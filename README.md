
# Bitespeed Task: Identity Reconciliation

This project implements an identity reconciliation service for Bitespeed, allowing the linking of different orders made with various contact information to the same customer. The web service exposes an endpoint `/identify` that consolidates customer contact details.

## Project Links

- **Main Net Project API**: [bitspeed-task-nh67.onrender.com](https://bitspeed-task-nh67.onrender.com)
- **GitHub Repository**: [github.com/Mohd-anas0693/bitspeed_task](https://github.com/Mohd-anas0693/bitspeed_task)

## Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/Mohd-anas0693/bitspeed_task.git
    cd bitspeed_task
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**
    - Create a `.env` file in the root directory.
    - Add the `DB_SECRET` environment variable, which is the database connection string.
    - Refer to the `.env.sample` file for guidance.
    ```plaintext
    DB_SECRET=your_database_connection_string
    ```

## Usage

1. **Start the Server**
    ```bash
    npm run dev
    ```

2. **API Endpoint**

    - **POST** `/identify`
      - **Request Body**:
        ```json
        {
          "email": "string",
          "phoneNumber": "number"
        }
        ```
      - **Response Body**:
        ```json
        {
          "contact": {
            "primaryContatctId": number,
            "emails": ["string"], // first element being email of primary contact 
            "phoneNumbers": ["string"], // first element being phoneNumber of primary contact
            "secondaryContactIds": [number] // Array of all Contact IDs that are "secondary"
          }
        }
        ```

## Example

**Request:**
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

## Stack Used

- Express.js (javaScript)
- Postgres (SQL Database)

## Database Schema

The `Contact` table structure:
```sql
CREATE TABLE Contact (
  id INT PRIMARY KEY,
  phoneNumber STRING,
  email STRING,
  linkedId INT, // the ID of another Contact linked to this one
  linkPrecedence STRING CHECK (linkPrecedence IN ('primary', 'secondary')),
  createdAt DATETIME,
  updatedAt DATETIME,
  deletedAt DATETIME
);
```

## Development

### Commits
Check out all commits  [here](https://github.com/Mohd-anas0693/bitspeed_task/commits/main/).

### Hosting
The application is hosted online and the endpoint is exposed. For free hosting services, you can use platforms like [render.com](https://render.com).

## Submission

Submitted the task to the following [submission link](https://forms.gle/3j3KF6zJumemhMkQ9).

## More About Bitespeed

- [Way Of Life At BiteSpeed - Our Values & Purpose](https://www.notion.so/Way-Of-Life-At-BiteSpeed-Our-Values-Purpose-44d9b9614d9641419da910189b1e9f8e?pvs=21)
- [BiteSpeed's Mission & the Future of Commerce](https://www.notion.so/BiteSpeed-s-Mission-the-Future-of-Commerce-b3cf14a080d94654ba46693c8cacd24f?pvs=21)
