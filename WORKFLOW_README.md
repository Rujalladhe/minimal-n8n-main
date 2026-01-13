# Workflow Database Feature

This feature allows you to save, load, update, list, and delete workflows using a local SQLite database.

## Setup

1.  **Install Dependencies** (if you haven't already):
    ```bash
    npm install
    ```

2.  **Initialize Database**:
    You need to generate the Prisma Client and push the schema to the database.
    ```bash
    npx prisma generate
    npx prisma db push
    ```
    *Note: This will create a `dev.db` file in your `prisma` directory (or root, depending on config).*

## Usage

1.  **Run the App**:
    ```bash
    npm run dev
    ```

2.  **Save a Workflow**:
    - Create nodes and edges on the canvas.
    - Click the **Save** button in the sidebar.
    - Enter a name for your workflow.
    - Click "Save".

3.  **Load a Workflow**:
    - Click the **Folder (Load)** button in the sidebar.
    - Select a workflow from the list.
    - confirm the canvas updates.

4.  **Update a Workflow**:
    - Load a workflow.
    - Make changes.
    - Click **Update** (the Save button text changes to Update when a workflow is loaded).

5.  **Delete a Workflow**:
    - Open the Load dialog.
    - Click the Trash icon next to the workflow you want to delete.

## Troubleshooting

-   **Prisma Errors**: If you see errors about `PrismaClient` not being initialized or found:
    -   Ensure you ran `npx prisma generate`.
    -   Check `.env` contains `DATABASE_URL="file:./dev.db"`.
    -   Restart the dev server.

-   **Database Location**: By default, SQLite stores data in a file. If you delete `dev.db`, you lose your saved workflows.
