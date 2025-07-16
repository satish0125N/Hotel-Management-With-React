-- Create a new table for room images
CREATE TABLE room_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
