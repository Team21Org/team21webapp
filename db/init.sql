q-- CONNECT TO simstockdb
\c simstockdb;

START TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET TRANSACTION READ WRITE;

CREATE SCHEMA simstockdb AUTHORIZATION postgres;

SET SCHEMA 'simstockdb';

CREATE DOMAIN simstockdb.DailyVolume AS INTEGER CONSTRAINT DailyVolume_Unsigned_Chk CHECK (VALUE >= 0);
CREATE DOMAIN simstockdb.PortfolioQuantity AS INTEGER CONSTRAINT PortfolioQuantity_Unsigned_Chk CHECK (VALUE >= 0);
CREATE DOMAIN simstockdb.OrderQuantity AS INTEGER CONSTRAINT OrderQuantity_Unsigned_Chk CHECK (VALUE >= 0);
CREATE DOMAIN simstockdb.AccessLevel AS CHARACTER(1) CONSTRAINT ValueTypeValueConstraint1 CHECK (VALUE IN ('A', 'C'));
CREATE DOMAIN simstockdb.BOOLEAN_TRUE AS BOOLEAN CONSTRAINT BOOLEAN_TRUE_CHK CHECK (VALUE = TRUE);

CREATE TABLE simstockdb.User
(
	userId INTEGER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) NOT NULL,
	email CHARACTER VARYING NOT NULL,
	fullName CHARACTER VARYING NOT NULL,
	pWord CHARACTER VARYING NOT NULL,
	username CHARACTER VARYING NOT NULL,
	accessLevel CHARACTER(1) DEFAULT 'C' NOT NULL, -- Added default access level
	permissionSetId INTEGER,
	CONSTRAINT User_PK PRIMARY KEY(userId),
	CONSTRAINT User_UC1 UNIQUE(username),
	CONSTRAINT User_UC2 UNIQUE(email)
);

CREATE TABLE simstockdb.Customer
(
	customerId INTEGER NOT NULL,
	portfolioId INTEGER NOT NULL,
	CONSTRAINT Customer_UC UNIQUE(portfolioId),
	CONSTRAINT Customer_PK PRIMARY KEY(customerId)
);

CREATE TABLE simstockdb.Stock
(
	stockTicker CHARACTER(4) NOT NULL,
	companyName CHARACTER VARYING(40) NOT NULL,
	currentPrice DECIMAL(19,2) NOT NULL,
	dailyVolume simstockdb.DailyVolume NOT NULL,
	openPrice DECIMAL(19,2) NOT NULL,
	priceHigh DECIMAL(19,2) NOT NULL,
	priceLow DECIMAL(19,2) NOT NULL,
	CONSTRAINT Stock_PK PRIMARY KEY(stockTicker)
);

CREATE TABLE simstockdb.Portfolio
(
	portfolioId INTEGER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) NOT NULL,
	CONSTRAINT Portfolio_PK PRIMARY KEY(portfolioId)
);

CREATE TABLE simstockdb.PortfolioObject
(
	portfolioObjectId INTEGER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) NOT NULL,
	portfolioQuantity simstockdb.PortfolioQuantity NOT NULL,
	stockTicker CHARACTER(4) NOT NULL,
	portfolioId INTEGER,
	CONSTRAINT PortfolioObject_PK PRIMARY KEY(portfolioObjectId)
);

CREATE TABLE simstockdb.MarketOrder
(
	marketOrderId INTEGER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) NOT NULL,
	customerId INTEGER NOT NULL,
	orderDate TIMESTAMP NOT NULL,
	orderPrice DECIMAL(19,2) NOT NULL,
	orderQuantity simstockdb.OrderQuantity NOT NULL,
	orderTypeCode CHARACTER(1) NOT NULL,
	stockTicker CHARACTER(4) NOT NULL,
	CONSTRAINT MarketOrder_PK PRIMARY KEY(marketOrderId),
	CONSTRAINT MarketOrder_orderTypeCode_RoleValueConstraint2 CHECK (orderTypeCode IN ('B', 'S'))
);

CREATE TABLE simstockdb.CashHoldings
(
	cashHoldingsId DECIMAL(19,2) NOT NULL,
	currentBalance CHARACTER VARYING NOT NULL,
	customerId INTEGER NOT NULL,
	CONSTRAINT CashHoldings_PK PRIMARY KEY(cashHoldingsId),
	CONSTRAINT CashHoldings_UC UNIQUE(customerId)
);

CREATE TABLE simstockdb.CashTransaction
(
	cashTransactionId INTEGER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) NOT NULL,
	amount CHARACTER VARYING NOT NULL,
	cashHoldingsId DECIMAL(19,2) NOT NULL,
	customerId INTEGER NOT NULL,
	transactTypeCode CHARACTER(1) NOT NULL,
	trasactDate TIMESTAMP NOT NULL,
	CONSTRAINT CashTransaction_PK PRIMARY KEY(cashTransactionId),
	CONSTRAINT CashTransaction_transactTypeCode_RoleValueConstraint3 CHECK (transactTypeCode IN ('D', 'W'))
);

CREATE TABLE simstockdb.MarketSchedule
(
	marketScheduleName CHARACTER VARYING NOT NULL,
	closeTime CHARACTER VARYING NOT NULL,
	"date" TIMESTAMP NOT NULL,
	isOpen BOOLEAN NOT NULL,
	openTime TIME NOT NULL,
	isHoliday simstockdb.BOOLEAN_TRUE,
	CONSTRAINT MarketSchedule_PK PRIMARY KEY(marketScheduleName)
);

CREATE TABLE simstockdb.StockHistory
(
	stockHistoryId INTEGER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) NOT NULL,
	"date" TIMESTAMP NOT NULL,
	stockTicker CHARACTER(4),
	CONSTRAINT StockHistory_PK PRIMARY KEY(stockHistoryId)
);

CREATE TABLE simstockdb.PermissionSet
(
    permissionSetId INTEGER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1) NOT NULL,
    accessLevel simstockdb.AccessLevel,
    userId INTEGER NOT NULL,
    CONSTRAINT PermissionSet_PK PRIMARY KEY(permissionSetId),
    CONSTRAINT PermissionSet_FK FOREIGN KEY (userId) REFERENCES simstockdb.User (userId) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE simstockdb.Permission
(
	permissionName CHARACTER VARYING NOT NULL,
	hasDelete BOOLEAN NOT NULL,
	hasModify BOOLEAN NOT NULL,
	hasModifyAll BOOLEAN NOT NULL,
	hasRead BOOLEAN NOT NULL,
	hasViewAll BOOLEAN NOT NULL,
	hasWrite BOOLEAN NOT NULL,
	objectName CHARACTER VARYING NOT NULL,
	permissionSetId INTEGER NOT NULL,
	CONSTRAINT Permission_PK PRIMARY KEY(permissionName, permissionSetId),
	CONSTRAINT Permission_FK FOREIGN KEY (permissionSetId) REFERENCES simstockdb.PermissionSet (permissionSetId) ON DELETE RESTRICT ON UPDATE RESTRICT
);



CREATE TABLE simstockdb.UserManagesMarketSchedule
(
	marketScheduleName CHARACTER VARYING NOT NULL,
	userId INTEGER NOT NULL,
	CONSTRAINT UserManagesMarketSchedule_PK PRIMARY KEY(userId, marketScheduleName)
);
-- Trigger function to create a PermissionSet and set permissionSetId for new users
CREATE OR REPLACE FUNCTION create_permission_set() RETURNS TRIGGER AS $$
BEGIN
    -- Insert a new PermissionSet for the user
    INSERT INTO simstockdb.PermissionSet (accessLevel, userId)
    VALUES (NEW.accessLevel, NEW.userId);

    -- Set the permissionSetId for the new user
    UPDATE simstockdb.User
    SET permissionSetId = (SELECT permissionSetId FROM simstockdb.PermissionSet WHERE userId = NEW.userId)
    WHERE userId = NEW.userId;

    -- Insert standard end-user privileges based on accessLevel
    IF NEW.accessLevel = 'C' THEN
        INSERT INTO simstockdb.Permission (permissionName, hasDelete, hasModify, hasModifyAll, hasRead, hasViewAll, hasWrite, objectName, permissionSetId)
        VALUES 
        ('UserAccess', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, 'simstockdb.User', (SELECT permissionSetId FROM simstockdb.PermissionSet WHERE userId = NEW.userId)),
        ('StockAccess', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, 'simstockdb.Stock', (SELECT permissionSetId FROM simstockdb.PermissionSet WHERE userId = NEW.userId)),
        ('PortfolioAccess', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, 'simstockdb.Portfolio', (SELECT permissionSetId FROM simstockdb.PermissionSet WHERE userId = NEW.userId)),
        ('MarketOrderAccess', FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, 'simstockdb.MarketOrder', (SELECT permissionSetId FROM simstockdb.PermissionSet WHERE userId = NEW.userId)),
        ('CashHoldingsAccess', FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, 'simstockdb.CashHoldings', (SELECT permissionSetId FROM simstockdb.PermissionSet WHERE userId = NEW.userId));
    ELSIF NEW.accessLevel = 'A' THEN
        INSERT INTO simstockdb.Permission (permissionName, hasDelete, hasModify, hasModifyAll, hasRead, hasViewAll, hasWrite, objectName, permissionSetId)
        VALUES 
        ('AdminAccess', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 'simstockdb.*', (SELECT permissionSetId FROM simstockdb.PermissionSet WHERE userId = NEW.userId));
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call creat_permission_set function after a new user is inserted
-- This trigger will automatically create a PermissionSet and set the permissionSetId for the new user
CREATE TRIGGER after_user_insert
AFTER INSERT ON simstockdb.User
FOR EACH ROW
EXECUTE FUNCTION create_permission_set();


-- Sample User Data
INSERT INTO simstockdb.User(
    email,
    fullName,
    pWord,
    username,
    accessLevel
)
VALUES 
('smooops@email.com', 'Moopy Doopins', 'password','MoopDoop21', 'C'),
('anotheremail@gmail.com','Jon Doe','password','jondoe','C');

INSERT INTO simstockdb.Stock(
	stockTicker,
	companyName,
	dailyVolume,
	openPrice,
	currentPrice,
	priceHigh,
	priceLow
)
VALUES
	('AAPL', 'Apple Inc.', 1000000, 150.00, 155.00, 160.00, 145.00),
	('GOGL', 'Alphabet Inc.', 800000, 2800.00, 2900.00, 2950.00, 2700.00),
	('AMZN', 'Amazon.com Inc.', 1200000, 3400.00, 3500.00, 3550.00, 3300.00),
	('MSFT', 'Microsoft Corp.', 900000, 300.00, 310.00, 315.00, 290.00),
	('TSLA', 'Tesla Inc.', 700000, 700.00, 750.00, 760.00, 680.00);

ALTER TABLE simstockdb.User ADD CONSTRAINT User_FK FOREIGN KEY (permissionSetId) REFERENCES simstockdb.PermissionSet (permissionSetId) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.Customer ADD CONSTRAINT Customer_FK1 FOREIGN KEY (portfolioId) REFERENCES simstockdb.Portfolio (portfolioId) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.Customer ADD CONSTRAINT Customer_FK2 FOREIGN KEY (customerId) REFERENCES simstockdb.User (userId) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.PortfolioObject ADD CONSTRAINT PortfolioObject_FK1 FOREIGN KEY (portfolioId) REFERENCES simstockdb.Portfolio (portfolioId) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.PortfolioObject ADD CONSTRAINT PortfolioObject_FK2 FOREIGN KEY (stockTicker) REFERENCES simstockdb.Stock (stockTicker) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.MarketOrder ADD CONSTRAINT MarketOrder_FK1 FOREIGN KEY (customerId) REFERENCES simstockdb.Customer (customerId) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.MarketOrder ADD CONSTRAINT MarketOrder_FK2 FOREIGN KEY (stockTicker) REFERENCES simstockdb.Stock (stockTicker) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.CashHoldings ADD CONSTRAINT CashHoldings_FK FOREIGN KEY (customerId) REFERENCES simstockdb.Customer (customerId) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.CashTransaction ADD CONSTRAINT CashTransaction_FK1 FOREIGN KEY (customerId) REFERENCES simstockdb.Customer (customerId) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.CashTransaction ADD CONSTRAINT CashTransaction_FK2 FOREIGN KEY (cashHoldingsId) REFERENCES simstockdb.CashHoldings (cashHoldingsId) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.StockHistory ADD CONSTRAINT StockHistory_FK FOREIGN KEY (stockTicker) REFERENCES simstockdb.Stock (stockTicker) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.Permission ADD CONSTRAINT Permission_FK1 FOREIGN KEY (permissionSetId) REFERENCES simstockdb.PermissionSet (permissionSetId) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.UserManagesMarketSchedule ADD CONSTRAINT UserManagesMarketSchedule_FK1 FOREIGN KEY (userId) REFERENCES simstockdb.User (userId) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE simstockdb.UserManagesMarketSchedule ADD CONSTRAINT UserManagesMarketSchedule_FK2 FOREIGN KEY (marketScheduleName) REFERENCES simstockdb.MarketSchedule (marketScheduleName) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Simulate a 5-minute processing time for market orders
-- This can be implemented in the application layer using a delay function or a scheduled task
-- Example: setTimeout(() => { /* execute order */ }, 300000); // 300000 ms = 5 minutes

COMMIT WORK;
