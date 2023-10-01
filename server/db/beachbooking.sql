CREATE TABLE Chalet (
    chalet_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    houseNumber VARCHAR(4) NOT NULL
);

CREATE TABLE Users (
    email VARCHAR(255) UNIQUE PRIMARY KEY,
    password VARCHAR(255)
);

CREATE TABLE Booking (
    booking_id SERIAL PRIMARY KEY,
    startDate DATE,
    endDate DATE,
    email VARCHAR(255),
    FOREIGN KEY (email) REFERENCES Users(email)
);

CREATE TABLE Sunshade (
    sunshade_id SERIAL PRIMARY KEY,
    num_row INT NOT NULL,
    num_column INT NOT NULL,
    num_deckchairs INT NOT NULL,
    num_sunbeds INT NOT NULL,
    deckchair_price DECIMAL(5,2) NOT NULL,
    sunbed_price DECIMAL(5,2) NOT NULL,
    chalet_id INT NOT NULL,
    booking_id INT,
    price DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (chalet_id) REFERENCES Chalet(chalet_id),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

-- INSERTS INTO TABLES --
-- One Chalet with multiple Sunshades with multiple DeckChairs and Sunbeds --
-- No Bookings nor Users are inserted in the db for now --

INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (1, 1, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (1, 2, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (1, 3, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (1, 4, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (1, 5, 2, 2, 5.00, 10.00, 1, NULL, 20.00);

INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (2, 1, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (2, 2, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (2, 3, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (2, 4, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (2, 5, 2, 2, 5.00, 10.00, 1, NULL, 20.00);

INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (3, 1, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (3, 2, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (3, 3, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (3, 4, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (3, 5, 2, 2, 5.00, 10.00, 1, NULL, 20.00);

INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (4, 1, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (4, 2, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (4, 3, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (4, 4, 2, 2, 5.00, 10.00, 1, NULL, 20.00);
INSERT INTO Sunshade (num_row, num_column, num_deckchairs, num_sunbeds, deckchair_price, sunbed_price, chalet_id, booking_id, price) VALUES (4, 5, 2, 2, 5.00, 10.00, 1, NULL, 20.00);