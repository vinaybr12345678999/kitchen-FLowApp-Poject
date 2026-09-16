KitchenFlow Documentation:
1. Project Overview
1.1 Project Name
KitchenFlow – Restaurant Order & Kitchen Management System
1.2 Project Description
KitchenFlow is a restaurant management application designed to manage the internal operational activities of a restaurant.
The application connects the restaurant's waiter, kitchen staff, and manager through a single system. A waiter can select a table, take the customer's order, and send the order to the kitchen. Kitchen staff can view active orders and update their preparation status. The manager can manage menu items, employees, orders, billing, and sales summaries.
The system is designed to provide a structured flow from order creation to kitchen preparation, serving, and billing.
The project is a staff-facing restaurant management system and is not designed as a food-delivery or customer online-ordering application. This aligns with the original project scope.
________________


1.3 Problem Statement
In a restaurant, order information needs to move accurately between the waiter, kitchen, and management.
In a traditional process, orders may be communicated using paper tickets or verbal communication, which can result in:
* Incorrect or missed orders
* Difficulty tracking order status
* Miscommunication of special instructions
* Difficulty monitoring multiple tables
* Lack of centralized order information
* Manual billing and tracking
* Difficulty monitoring restaurant sales and operations
A restaurant therefore needs a centralized system that can manage tables, orders, menu items, kitchen operations, employees, and billing in a structured manner.
________________


1.4 Proposed Solution
KitchenFlow provides a centralized digital solution for restaurant order and kitchen management.
The system allows:
* Waiters to select tables and create customer orders.
* Kitchen staff to view incoming orders and update their preparation status.
* Managers to manage menu items and employees, monitor orders, generate bills, and view earnings summaries.
The order follows a controlled lifecycle:
NEW → PREPARING → READY → SERVED
Once the order is served, the manager can generate the bill. This creates a complete operational flow from taking the order to completing the billing process.
The project brief identifies this controlled order lifecycle and role-based operation as core parts of KitchenFlow.
________________


1.5 Project Scope
The scope of KitchenFlow includes the following major areas:
Authentication and Authorization
* User login
* JWT-based authentication
* Role-based access
* Separate access for Waiter, Kitchen Staff, and Manager
Table Management
* View restaurant tables
* Identify available and occupied tables
* Select tables for taking orders
* Update table status based on the order and billing process
Order Management
* Create orders for tables
* Select menu items
* Specify quantities
* Add special instructions
* Track order status
* Support multiple orders for an occupied table
Kitchen Management
* Display active orders
* Show table number, items, quantities, and instructions
* Update orders through preparation stages
* Automatically refresh active orders using polling
Menu Management
* Add menu items
* Edit menu items
* Delete menu items
* Organize items by category
* Manage item availability
Employee Management
* Add employees
* Manage employee information
* Assign employee roles
* Remove employees
Billing
* Generate bills for served orders
* Calculate bill totals
* Display bill information
* Make the table available again after billing
Reports and Summary
* View order information
* View total earnings
* View order and earnings summaries
________________


1.6 Key Features
The major features of KitchenFlow are:
1. Role-Based Access
Different users receive different screens and permissions based on their roles.
2. Table Management
Waiters can identify available tables and associate orders with the selected table.
3. Order Management
Waiters can create orders with multiple menu items, quantities, and special instructions.
4. Kitchen Order Management
Kitchen staff can view active orders and update their preparation status.
5. Order Lifecycle Management
Orders follow a defined workflow from NEW → PREPARING → READY → SERVED.
6. Live Order Updates
The kitchen and other relevant screens periodically fetch updated order information using polling rather than requiring manual page refreshes.
7. Menu Management
Managers can add, edit, delete, and control the availability of menu items.
8. Employee Management
Managers can manage restaurant employees and assign appropriate roles.
9. Billing Management
Managers can generate bills after orders are served.
10. Order and Earnings Summary
Managers can view summarized information about restaurant orders and earnings.
11. Separation of Kitchen and Billing Information
Kitchen staff work with items, quantities, and instructions, while pricing information is handled during billing. This separation was an explicit design principle in the project brief.

2. Objectives and Scope
2.1 Project Objectives
The main objective of KitchenFlow is to provide a simple and centralized system for managing restaurant orders, kitchen operations, menu items, employees, and billing.
The key objectives are:
   * Simplify order taking: Allow waiters to select a table, choose menu items, add quantities and special instructions, and send orders to the kitchen.
   * Improve kitchen coordination: Provide kitchen staff with clear and updated order information without showing unnecessary details such as prices.
   * Track order status: Manage the order lifecycle from New → Preparing → Ready → Served.
   * Control access: Provide different features based on the user's role, such as Waiter, Kitchen Staff, and Manager.
   * Manage menu items: Allow the manager to add, edit, remove, and control the availability of menu items.
   * Manage employees: Allow the manager to create and manage waiter and kitchen staff accounts.
   * Simplify billing: Allow the manager to generate bills for completed orders and track earnings.
   * Reduce manual errors: Keep order, table, and billing information organized in one system.
2.2 Project Scope
KitchenFlow covers the main operational activities required inside a restaurant.
In Scope
   * User login and role-based access
   * Table availability management
   * Taking customer orders through the waiter
   * Menu browsing by category
   * Quantity and special instruction handling
   * Sending orders to the kitchen
   * Kitchen order status updates
   * Menu item management
   * Employee management
   * Order tracking
   * Billing
   * Orders and earnings summary
   * Monthly sales summary
The current system focuses on restaurant staff operations, with the waiter acting as the primary person responsible for recording customer orders.
3. User Roles and Responsibilities
KitchenFlow uses role-based access so that each user can access only the features required for their work.
The system has three main roles:
3.1 Waiter
The Waiter is responsible for taking customer orders and coordinating them with the kitchen.
Responsibilities
   * Log in to the system.
   * View available and occupied tables.
   * Select a table for taking an order.
   * Browse menu items by category.
   * Select menu items and quantities.
   * Add special instructions when required.
   * Send orders to the kitchen.
   * View the current status of orders.
   * Mark a ready order as served.
3.2 Kitchen Staff
Kitchen Staff are responsible for preparing orders and updating their status.
Responsibilities
   * Log in to the kitchen view.
   * View active orders.
   * See the table number and ordered items.
   * View quantities and special instructions.
   * Update the order status:
   * New → Preparing
   * Preparing → Ready
   * Monitor new orders as they arrive.
Kitchen Staff do not see customer billing information or item prices.
3.3 Manager
The Manager is responsible for managing the restaurant's overall operations through the system.
Responsibilities
   * Log in to the Manager dashboard.
   * Manage menu items.
   * Set menu items as available or unavailable.
   * Add, edit, and remove menu items.
   * Manage waiter and kitchen staff accounts.
   * View all orders and their statuses.
   * Generate bills for completed orders.
   * View order and earnings summaries.
   * View monthly sales information.
This role separation keeps the application simple, secure, and focused on each user's responsibilities.

4. Functional Requirements
Functional requirements describe the main operations that KitchenFlow should perform for its users.
4.1 Authentication
   * The system shall allow registered users to log in using their credentials.
   * The system shall identify the user's role after login.
   * The system shall provide access based on the user's role.
   * Unauthorized users shall not be allowed to access protected features.
4.2 Table Management
   * The system shall display restaurant tables and their current status.
   * Tables shall have two main statuses:
   * Available
   * Occupied
   * A waiter shall be able to select an available table when taking an order.
   * A table shall remain occupied while it has active orders.
   * A table shall become available after the billing process is completed.
4.3 Order Management
   * The waiter shall be able to create an order for a selected table.
   * The waiter shall be able to select menu items.
   * The waiter shall be able to specify the quantity of each item.
   * The waiter shall be able to add special instructions.
   * The system shall send the order to the kitchen.
   * Multiple orders can be taken for the same occupied table when required.
4.4 Order Status Management
The system shall maintain the order through different stages:
New → Preparing → Ready → Served
   * Kitchen staff shall update orders from New to Preparing.
   * Kitchen staff shall update orders from Preparing to Ready.
   * The waiter shall mark a ready order as Served.
   * The system shall prevent invalid status changes.
4.5 Menu Management
The Manager shall be able to:
   * Add new menu items.
   * Edit existing menu items.
   * Remove menu items.
   * Set menu items as available or unavailable.
   * Organize menu items into categories.
   * Maintain item price and other required information.
Unavailable menu items shall not be available for selection when taking an order.
4.6 Kitchen Operations
   * Kitchen staff shall be able to view active orders.
   * The kitchen view shall display the table number, items, quantities, and special instructions.
   * Item prices shall not be displayed to kitchen staff.
   * The kitchen screen shall periodically refresh to show new or updated orders.
4.7 Employee Management
The Manager shall be able to:
   * Add employee accounts.
   * Assign employees as Waiter or Kitchen Staff.
   * Edit employee information.
   * Remove employee accounts.
   * View employee details.
4.8 Billing
   * The Manager shall be able to generate a bill after the orders for a table are served.
   * The bill shall contain ordered items, quantities, prices, and the total amount.
   * The system shall maintain billing information.
   * After billing is completed, the table shall become available for the next customer.
4.9 Orders and Earnings Summary
   * The Manager shall be able to view the total number of completed orders.
   * The Manager shall be able to view total earnings.
   * The Manager shall be able to view monthly order and earnings information.
   * Earnings shall be based on generated bills.
4.10 Error and Empty States
The system shall provide appropriate feedback when:
   * Data is loading.
   * No records are available.
   * An API request fails.
   * An invalid operation is attempted.
   * A required field is missing.
This helps users understand what is happening instead of leaving the screen in an unclear state.

5. Technology Stack
KitchenFlow is a full-stack web application developed using modern web technologies.
5.1 Frontend
   * React: Used to build the application's user interface.
   * TypeScript: Used for type-safe frontend development.
   * Redux Toolkit: Used for managing application state.
   * React Router: Used for navigation between different screens.
   * Axios: Used for communication between the frontend and backend APIs.
   * Bootstrap: Used for responsive UI components and layout.
   * CSS: Used for custom application styling.
5.2 Backend
   * Node.js: Provides the runtime environment for the backend.
   * Express.js: Used to create the REST APIs and handle HTTP requests.
   * TypeScript: Used for backend development with type checking.
   * Mongoose: Used to connect the application with MongoDB and work with database models.
5.3 Database
   * MongoDB: Used to store application data such as:
   * Users and employees
   * Tables
   * Menu items
   * Orders
   * Bills
5.4 Authentication and Security
   * JWT (JSON Web Token): Used to authenticate users and maintain login sessions.
   * bcrypt: Used to securely hash user passwords before storing them in the database.
   * Role-Based Access Control: Used to restrict features according to the user's role.
5.5 Development Tools
   * Visual Studio Code: Used for writing and managing the project code.
   * Git: Used for source code version control.
   * npm: Used for managing project dependencies and running application scripts.
5.6 Technology Flow
The technologies work together in the following way:
React + TypeScript
↓
Axios API Requests
↓
Express + Node.js Backend
↓
Mongoose
↓
MongoDB Database
This architecture separates the user interface, business logic, and data storage, making the application easier to maintain and extend.

6. System Architecture
KitchenFlow follows a three-layer architecture consisting of the frontend, backend, and database.
6.1 Architecture Overview
The application works through the following flow:
User
↓
React Frontend
↓
REST API
↓
Node.js + Express Backend
↓
MongoDB Database
Each layer has a specific responsibility.
6.2 Frontend Layer
The frontend is developed using React and TypeScript.
It is responsible for:
   * Displaying the application screens.
   * Providing different interfaces for Waiter, Kitchen Staff, and Manager.
   * Taking user input.
   * Sending requests to the backend.
   * Displaying data received from the backend.
   * Managing frontend application state using Redux Toolkit.
For example, when a waiter creates an order, the frontend collects the selected table, menu items, quantities, and instructions and sends them to the backend.
6.3 Backend Layer
The backend is developed using Node.js, Express, and TypeScript.
It is responsible for:
   * Receiving requests from the frontend.
   * Authenticating users.
   * Checking user roles and permissions.
   * Validating requests.
   * Applying business rules.
   * Creating and updating orders.
   * Managing menu items, tables, employees, and bills.
   * Communicating with the MongoDB database.
   * Sending appropriate responses back to the frontend.
The backend acts as the main control layer of the application.
6.4 Database Layer
KitchenFlow uses MongoDB with Mongoose.
The database stores information related to:
   * Users and employees
   * Restaurant tables
   * Menu items
   * Orders
   * Bills
The backend communicates with MongoDB through Mongoose models.
6.5 Role-Based Interaction
Different users interact with the same backend but have different permissions.
Waiter
→ Select table
→ Create order
→ Send order to kitchen
→ Track order
→ Mark ready order as served
Kitchen Staff
→ View active orders
→ Prepare orders
→ Update order status
Manager
→ Manage menu
→ Manage employees
→ View orders
→ Generate bills
→ View earnings summaries
6.6 Data Flow Example
When a waiter places an order:
   1. The waiter selects a table and menu items from the React application.
   2. The frontend sends the order details to the backend using an API request.
   3. The backend authenticates the request and checks the user's role.
   4. The backend validates the order and stores it in MongoDB.
   5. The kitchen can then see the new order.
   6. Kitchen staff update the order as it moves through the preparation stages.
   7. The waiter can see the updated status.
   8. Once the order is served, the Manager can generate the bill.
This architecture keeps UI, application logic, and data storage separate, making the system easier to understand, maintain, and extend.

7. Project Structure
KitchenFlow is divided into two main parts:
   * Frontend: Handles the user interface and user interactions.
   * Backend: Handles APIs, business logic, authentication, and database operations.
The overall structure is:
KitchenFlow/
│
├── frontend/
│   └── kitchenflow/
│
└── backend/


7.1 Frontend Structure
The frontend is developed using React and TypeScript.
The main structure is:
frontend/
└── kitchenflow/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── store/
    │   ├── utils/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── colors.css
    │
    ├── package.json
    └── ...


Important Frontend Folders
components/
Contains reusable UI components used across different screens.
pages/
Contains the main application screens for different roles, such as Waiter, Kitchen Staff, and Manager.
services/
Contains API-related code used to communicate with the backend.
store/
Contains Redux Toolkit state management, including slices and store configuration.
utils/
Contains commonly used utility functions, such as authentication-related functions.
Important Frontend Files
App.tsx
Defines the main application routes and connects different screens.
main.tsx
Acts as the entry point of the React application and initializes the application.
colors.css
Contains the common color variables used throughout the application.
7.2 Backend Structure
The backend is developed using Node.js, Express, TypeScript, and Mongoose.
The main structure is:
backend/
└── src/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── server.ts
    └── ...


Important Backend Folders
controllers/
Contains the main logic for handling API requests and responses.
middleware/
Contains common request-processing logic such as authentication and role checking.
models/
Contains Mongoose models that define the structure of data stored in MongoDB.
routes/
Defines the API endpoints and connects them to the appropriate controllers.
services/
Contains supporting backend operations used by the application.
Important Backend Files
server.ts
The main entry point of the backend. It starts the Express server, connects the application to MongoDB, and registers the API routes.
.env
Stores environment-specific configuration such as the server port, MongoDB connection string, and JWT secret.
7.3 Main Backend Modules
KitchenFlow has separate modules for its major operations:
Authentication
      │
      ├── Users / Employees
      │
      ├── Tables
      │
      ├── Menu Items
      │
      ├── Orders
      │
      └── Bills


Separating these modules makes the application easier to maintain because each module has a clear responsibility.
7.4 Overall Project Organization
The project follows a simple separation of responsibilities:
Frontend
   ↓
User Interface + State Management
   ↓
API Services
   ↓
Backend Routes
   ↓
Controllers / Business Logic
   ↓
Models
   ↓
MongoDB
This structure allows frontend and backend development to remain separate while communicating through REST APIs.

8. Database Design
KitchenFlow uses MongoDB as its database. Mongoose is used in the backend to define the structure of the data and communicate with MongoDB.
The main collections used by the application are:
   * Users
   * Tables
   * Menu Items
   * Orders
   * Bills
8.1 User Collection
The User collection stores login and employee information.
Field
	Description
	_id
	Unique identifier for the user
	name
	Name of the employee
	email
	Login email
	password
	Hashed password
	role
	User role such as WAITER, KITCHEN, or MANAGER
	phone
	Employee contact number
	profileImage
	Employee profile image
	The user's role determines which features the user can access.
8.2 Table Collection
The Table collection stores restaurant table information.
Field
	Description
	_id
	Unique identifier for the table
	tableNumber
	Restaurant table number
	status
	Current status of the table
	The table status can be:
   * AVAILABLE
   * OCCUPIED
A table becomes occupied when an order is created and becomes available again after billing is completed.
8.3 Menu Item Collection
The Menu Item collection stores the restaurant's menu.
Field
	Description
	_id
	Unique identifier for the menu item
	name
	Name of the menu item
	category
	Menu category
	price
	Price of the item
	isAvailable
	Indicates whether the item can currently be ordered
	image
	Image associated with the item
	Menu items are grouped into categories such as:
   * Starter
   * Main Course
   * Beverages
   * Desserts
8.4 Order Collection
The Order collection stores customer orders.
Field
	Description
	_id
	Unique identifier for the order
	tableId
	Reference to the table
	createdBy
	Reference to the user who created the order
	items
	List of ordered items
	status
	Current order status
	createdAt
	Time when the order was created
	Each item inside an order contains information such as:
   * Menu item reference
   * Item name
   * Quantity
   * Special instruction
   * Unit price
The order status follows:
NEW → PREPARING → READY → SERVED
8.5 Bill Collection
The Bill collection stores billing information for completed orders.
Field
	Description
	_id
	Unique identifier for the bill
	orderIds
	Orders included in the bill
	tableId
	Reference to the table
	items
	Items included in the bill
	total
	Total bill amount
	generatedAt
	Time when the bill was generated
	A bill can include multiple orders from the same table. This supports situations where additional orders are taken for an already occupied table.
8.6 Relationships Between Collections
The main relationships are:
User
 │
 └── creates ──> Order
                    │
                    ├── belongs to ──> Table
                    │
                    └── contains ──> Menu Items
                                     
Order
 │
 └── included in ──> Bill


Example Flow
   1. A User with the Waiter role creates an order.
   2. The order is associated with a Table.
   3. The order contains one or more Menu Items.
   4. The order moves through its status lifecycle.
   5. After the orders are served, the Manager generates a Bill.
   6. The table becomes available after billing.
8.7 Database Design Approach
The database is divided into separate collections based on the responsibility of each type of data.
This approach helps KitchenFlow:
   * Keep data organized.
   * Avoid storing unrelated information together.
   * Maintain relationships between tables, orders, users, and bills.
   * Support multiple orders for one table.
   * Make future changes easier to manage.

9. API Design
KitchenFlow uses REST APIs to allow the React frontend to communicate with the Node.js and Express backend.
The APIs are organized according to the main modules of the application.
9.1 Authentication APIs
Method
	Endpoint
	Purpose
	Access
	POST
	/api/auth/login
	Authenticate a user and generate a login token
	Public
	The login API verifies the user's credentials and returns a JWT token when authentication is successful.
9.2 Table APIs
Method
	Endpoint
	Purpose
	Access
	GET
	/api/tables
	View restaurant tables and their status
	Authenticated users
	POST
	/api/tables
	Create a new table
	Manager
	PUT
	/api/tables/:id
	Update table information
	Manager
	DELETE
	/api/tables/:id
	Remove a table
	Manager
	Table APIs are used to manage and monitor table availability.
9.3 Menu Item APIs
Method
	Endpoint
	Purpose
	Access
	GET
	/api/menu-items
	View available menu items
	Authenticated users
	POST
	/api/menu-items
	Add a menu item
	Manager
	PUT
	/api/menu-items/:id
	Update a menu item
	Manager
	DELETE
	/api/menu-items/:id
	Remove a menu item
	Manager
	The menu API also supports controlling whether an item is currently available for ordering.
9.4 Order APIs
Methd
	Endpoint
	Purpose
	Access
	POST
	/api/orders
	Create a new order
	Waiter
	GET
	/api/orders/active
	View active orders
	Waiter, Kitchen, Manager
	GET
	/api/orders/manager
	View orders for management and billing
	Manager
	PATCH
	/api/orders/:id/status
	Update order status
	Waiter, Kitchen
	The order APIs manage the complete order lifecycle:
NEW → PREPARING → READY → SERVED
The backend also validates the allowed status transitions.
9.5 Bill APIs
Method
	Endpoint
	Purpose
	Access
	POST
	/api/bills
	Generate a bill for served orders
	Manager
	GET
	/api/bills
	View billing information
	Manager
	The billing APIs are used after orders for a table have been served.
Once billing is completed, the table can be made available for the next customer.
9.6 Employee APIs
Method
	Endpoint
	Purpose
	Access
	GET
	/api/employees
	View employees
	Manager
	POST
	/api/employees
	Create an employee account
	Manager
	PUT
	/api/employees/:id
	Update employee information
	Manager
	DELETE
	/api/employees/:id
	Remove an employee
	Manager
	Employee APIs allow the Manager to maintain Waiter and Kitchen Staff accounts.
9.7 API Request Flow
A typical API request follows this flow:
User Action
    ↓
React Frontend
    ↓
Axios Request
    ↓
Authentication Middleware
    ↓
Role Middleware
    ↓
Route
    ↓
Controller
    ↓
Mongoose Model
    ↓
MongoDB
    ↓
Response
    ↓
React Frontend


For protected APIs, the JWT token is sent with the request. The backend verifies the token and checks whether the user's role has permission to perform the requested operation.
9.8 API Design Principles
The API design follows a few simple principles:
   * APIs are grouped by application module.
   * HTTP methods are used according to the operation.
   * Protected APIs require authentication.
   * Role-based permissions are checked on the backend.
   * The backend validates important business rules.
   * The frontend receives clear success or error responses.
   * Database operations are handled through Mongoose models.
This API structure keeps communication between the frontend and backend organized, secure, and easy to maintain.

10. Authentication and Authorization
KitchenFlow uses authentication and role-based authorization to control access to the application.
10.1 Authentication
Authentication verifies who the user is.
When a user logs in:
   1. The user enters their email and password.
   2. The frontend sends the login details to the backend.
   3. The backend checks the user details in the database.
   4. The password is verified against the stored hashed password.
   5. If the credentials are correct, the backend generates a JWT token.
   6. The frontend stores the token for authenticated requests.
   7. The user is allowed to access the application.
If the credentials are incorrect, the login request is rejected.
10.2 Password Security
Passwords are not stored as plain text.
KitchenFlow uses bcrypt to hash passwords before storing them in MongoDB.
This means the actual password cannot be directly read from the database.
10.3 JWT Authentication
KitchenFlow uses JSON Web Token (JWT) for authenticated API requests.
The basic flow is:
User Login
    ↓
Backend verifies credentials
    ↓
JWT Token generated
    ↓
Token stored by Frontend
    ↓
Token sent with protected API requests
    ↓
Backend verifies Token
    ↓
Request is allowed


The frontend sends the token using the Authorization header when accessing protected APIs.
10.4 Authorization
Authorization determines what an authenticated user is allowed to do.
KitchenFlow uses three roles:
   * WAITER
   * KITCHEN
   * MANAGER
After authentication, the backend checks the user's role before allowing access to restricted operations.
For example:
   * A Waiter can create orders.
   * Kitchen Staff can update preparation status.
   * A Manager can manage menu items and employees.
   * Only the Manager can generate bills.
10.5 Role-Based Access Control
The application uses middleware to enforce role-based permissions.
The basic flow is:
API Request
    ↓
Authentication Check
    ↓
Is JWT valid?
    ↓
Role Check
    ↓
Does the user have permission?
    ↓
Allow or Reject Request


This prevents users from accessing operations that do not belong to their role.
10.6 Authentication vs Authorization
Authentication
	Authorization
	Verifies who the user is
	Determines what the user can access
	Uses login credentials
	Uses the user's role
	Generates a JWT token
	Checks permissions
	Happens before protected access
	Controls specific operations
	For example, successfully logging in proves that a user is valid. Their role then determines whether they can manage the menu, update an order, or generate a bill.
10.7 Security Benefit
This approach provides an additional layer of protection because access restrictions are enforced by the backend, not only by the frontend interface.
Therefore, simply changing the frontend URL or screen does not give a user permission to perform a restricted operation.


11. Application Workflows
KitchenFlow follows a clear workflow where orders move from the waiter to the kitchen and finally to billing.
11.1 Login Workflow
User opens KitchenFlow
        ↓
Enters email and password
        ↓
Backend verifies credentials
        ↓
JWT token generated
        ↓
User is redirected according to role
        ↓
Waiter / Kitchen / Manager Dashboard


11.2 Waiter Workflow
The Waiter is responsible for recording customer orders.
Login
  ↓
View Tables
  ↓
Select Available Table
  ↓
View Menu
  ↓
Select Items
  ↓
Enter Quantities
  ↓
Add Special Instructions (if required)
  ↓
Place Order
  ↓
Order sent to Kitchen
  ↓
Track Order Status
  ↓
Mark Ready Order as Served


The waiter can also take additional orders for an already occupied table when required.
11.3 Kitchen Workflow
Kitchen Staff receive orders from the waiter and prepare them.
Login
  ↓
View Active Orders
  ↓
New Order
  ↓
Start Preparing
  ↓
Prepare Items
  ↓
Mark Order as Ready


The kitchen screen periodically refreshes so that newly created or updated orders can be displayed without requiring the user to manually refresh the page.
11.4 Order Lifecycle
Every order follows a controlled lifecycle:
NEW
 ↓
PREPARING
 ↓
READY
 ↓
SERVED


New
The waiter has created and submitted the order.
Preparing
Kitchen Staff have started preparing the order.
Ready
The order has been prepared and is ready to be served.
Served
The waiter has served the order to the customer.
The system controls these transitions to prevent invalid order status changes.
11.5 Manager Workflow
The Manager handles restaurant administration.
Login
  ↓
Manager Dashboard
  │
  ├── Manage Menu
  │
  ├── Manage Employees
  │
  ├── View Orders
  │
  └── Orders and Earnings Summary


The Manager can manage menu availability, maintain employee accounts, monitor orders, generate bills, and view earnings information.
11.6 Billing Workflow
Billing takes place after the orders for a table have been served.
Orders Served
      ↓
Manager Views Orders
      ↓
Check Served Orders
      ↓
Generate Bill
      ↓
Calculate Total
      ↓
Bill Stored
      ↓
Table Becomes Available


If multiple orders were taken for the same table, they can be included in the same bill.
11.7 Complete Restaurant Workflow
The complete KitchenFlow process can be summarized as:
Customer
   ↓
Waiter takes order
   ↓
Order created
   ↓
Kitchen receives order
   ↓
Kitchen prepares order
   ↓
Order marked Ready
   ↓
Waiter serves customer
   ↓
Order marked Served
   ↓
Manager generates bill
   ↓
Table becomes Available


This workflow connects the major restaurant activities into one system and ensures that the order progresses through each stage in the correct sequence.

12. UI / Screen Description
KitchenFlow provides different screens based on the user's role. Each screen is designed to support a specific restaurant operation.
12.1 Login Screen
The Login screen is the entry point to the application.
The user provides:
   * Email
   * Password
After successful authentication, the user is redirected to the appropriate area based on their role.
12.2 Waiter Table Screen
The Waiter can view restaurant tables and their current status.
The screen indicates whether a table is:
   * Available
   * Occupied
The waiter can select an available table to start taking an order.
12.3 Menu Items Screen
The Menu Items screen displays the restaurant's menu.
Menu items are organized by categories such as:
   * Starters
   * Main Course
   * Beverages
   * Desserts
When taking an order, the waiter can:
   * Select menu items.
   * Set quantities.
   * Add special instructions.
   * Place the order for the selected table.
Unavailable menu items cannot be selected for ordering.
12.4 Kitchen Orders Screen
The Kitchen screen displays active orders that need preparation.
Each order provides important information such as:
   * Table number
   * Ordered items
   * Quantity
   * Special instructions
   * Current status
Prices are not displayed on the kitchen screen because they are not required for food preparation.
The screen automatically refreshes periodically to show new orders and status changes.
12.5 Manager Dashboard
The Manager Dashboard provides access to the main management functions.
The dashboard contains options for:
   * View Orders & Billing
   * Menu Management
   * Orders and Earnings Summary
   * Employee Management
This provides the Manager with a central location for restaurant administration.
12.6 Menu Management Screen
The Manager can manage restaurant menu items from this screen.
The Manager can:
   * Add menu items.
   * Edit menu items.
   * Remove menu items.
   * Set items as available or unavailable.
   * Maintain item price and category.
   * Add or update item images.
12.7 Employee Management Screen
This screen allows the Manager to manage restaurant staff accounts.
The Manager can:
   * Add employees.
   * Enter employee details.
   * Assign the employee role.
   * Edit employee information.
   * Remove employees.
The available employee roles are Waiter and Kitchen Staff.
12.8 Orders and Billing Screen
The Manager can view orders and their current status from this screen.
For completed orders, the Manager can:
   * Review order details.
   * Generate a bill.
   * View the generated bill.
   * Check the total amount.
Multiple orders belonging to the same table can be included in the billing process.
12.9 Orders and Earnings Summary
This screen provides a simple overview of restaurant performance.
The Manager can view:
   * Total orders.
   * Total earnings.
   * Monthly order information.
   * Monthly earnings information.
The summary is based on completed billing information.
12.10 Navigation and User Experience
The application provides role-specific navigation so that users can focus on the features relevant to their responsibilities.
The UI also provides feedback for common situations such as:
   * Loading data.
   * Successful operations.
   * Failed operations.
   * Empty data.
   * Invalid actions.
This helps make the application easier to use during normal restaurant operations.

13. User Manual
This section explains how each type of user can use KitchenFlow.
13.1 Getting Started
   1. Open the KitchenFlow application.
   2. Enter your registered email and password.
   3. Click Login.
   4. The system will open the appropriate screen based on your role.
________________


13.2 Waiter User Manual
Step 1: Login
Log in using the Waiter account.
Step 2: Select a Table
   1. Open the table screen.
   2. Check the table status.
   3. Select an Available table.
   4. Continue to the menu.
Step 3: Select Menu Items
   1. Browse the menu by category.
   2. Select the required items.
   3. Enter the quantity.
   4. Add special instructions if required.
   5. Review the selected items.
Step 4: Place the Order
Click Place Order.
The order is sent to the backend and becomes available to the kitchen.
The selected table becomes Occupied.
Step 5: Track the Order
The waiter can monitor the order status.
NEW → PREPARING → READY
Step 6: Serve the Order
When the kitchen marks the order as Ready, the waiter serves the order to the customer and marks it as Served.
________________


13.3 Kitchen Staff User Manual
Step 1: Login
Log in using the Kitchen Staff account.
Step 2: View Active Orders
The kitchen screen displays active orders.
The staff can see:
   * Table number
   * Menu items
   * Quantities
   * Special instructions
Prices are not displayed.
Step 3: Start Preparing
When a new order is received:
   1. Open the order.
   2. Start preparing the items.
   3. Change the status from New to Preparing.
Step 4: Mark the Order Ready
After preparation is completed:
   1. Confirm that the items are ready.
   2. Change the status to Ready.
The waiter can then see that the order is ready to be served.
________________


13.4 Manager User Manual
Step 1: Login
Log in using the Manager account.
The Manager Dashboard provides access to the main management functions.
Step 2: Manage Menu
Open Menu Management.
The Manager can:
   * Add a new menu item.
   * Edit an existing item.
   * Remove an item.
   * Change availability.
   * Update price and category.
   * Add or update an image.
Step 3: Manage Employees
Open Employee Management.
The Manager can:
   1. Add a new employee.
   2. Enter employee information.
   3. Assign the role as Waiter or Kitchen Staff.
   4. Edit employee information when required.
   5. Remove an employee when required.
Step 4: View Orders
Open View Orders & Billing.
The Manager can monitor orders and their current status.
Step 5: Generate a Bill
After all relevant orders for a table have been served:
   1. Open the order information.
   2. Review the completed orders.
   3. Select Generate Bill.
   4. Review the bill details and total.
   5. View the generated bill.
After billing is completed, the table becomes available again.
Step 6: View Summary
Open Orders and Earnings Summary.
The Manager can view:
   * Total orders.
   * Total earnings.
   * Monthly order information.
   * Monthly earnings information.
________________


13.5 Important Usage Rules
   * A waiter should select an available table before creating an order.
   * Only available menu items should be ordered.
   * Order statuses should be updated in the correct sequence.
   * Kitchen Staff should update preparation-related statuses.
   * The waiter marks a ready order as served.
   * Billing is performed by the Manager.
   * A table becomes available after the billing process is completed.
These steps provide the normal operating procedure for KitchenFlow.

14. Installation and Setup
KitchenFlow is designed to run locally using a separate frontend and backend application.
14.1 Prerequisites
Before running the application, the following should be installed:
   * Node.js
   * npm
   * MongoDB database
   * Visual Studio Code 
   * Git, if the project is being obtained from a repository
14.2 Project Setup
The project contains two separate applications:
KitchenFlow/
├── frontend/
│   └── kitchenflow/
│
└── backend/


Both applications need to be installed and started separately.
14.3 Backend Setup
Step 1: Open the Backend Folder
Open a terminal and navigate to the backend directory.
cd backend


Step 2: Install Dependencies
Run:
npm install


This installs the packages required by the backend.
Step 3: Configure Environment Variables
Create a .env file in the backend folder.
The required configuration includes:
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT secret>


The MongoDB connection string is used to connect the backend to the database.
The JWT secret is used for authentication tokens.
Step 4: Start the Backend
Run the backend using the configured npm script.
The backend starts on the configured port, for example:
http://localhost:5000


14.4 Frontend Setup
Step 1: Open the Frontend Folder
Navigate to the React application:
cd frontend/kitchenflow


Step 2: Install Dependencies
Run:
npm install


Step 3: Configure API URL
The frontend uses an environment variable to identify the backend API.
For local development, it can point to:
http://localhost:5000/api


Step 4: Start the Frontend
Run the configured development command:
npm run dev


The frontend will be available through the URL displayed by Vite in the terminal.
14.5 Database Setup
KitchenFlow uses MongoDB to store application data.
The backend connects to MongoDB using the connection string configured in the .env file.
The main application data is stored in collections for:
   * Users
   * Tables
   * Menu Items
   * Orders
   * Bills
An initial Manager account is required to access the management features.
14.6 Running the Complete Application
For local development, both applications should be running:
Frontend
   ↓
React + Vite
   ↓
Backend API
   ↓
Express + Node.js
   ↓
MongoDB


The normal startup sequence is:
   1. Start MongoDB or ensure the configured MongoDB database is accessible.
   2. Start the backend.
   3. Start the frontend.
   4. Open the frontend URL in a browser.
   5. Log in using a registered account.
   6. Use the application according to the assigned role.
14.7 Basic Setup Verification
After starting the application, verify the following:
   * Frontend opens successfully.
   * Backend is running without errors.
   * Backend can connect to MongoDB.
   * Login works correctly.
   * The appropriate dashboard opens after login.
   * API requests are successfully reaching the backend.
If all these checks are successful, KitchenFlow is ready for local use.

15. Testing
Testing was performed to verify that the main features of KitchenFlow work correctly and that users can perform only the operations allowed by their roles.
15.1 Testing Approach
The application was tested by performing different user actions and checking whether the expected result was produced.
The main areas tested were:
   * Authentication
   * Role-based access
   * Table management
   * Menu management
   * Order management
   * Order status flow
   * Kitchen operations
   * Employee management
   * Billing
   * Summary information
   * Error handling
15.2 Functional Test Cases
Test Case
	Expected Result
	Login with valid credentials
	User is logged in successfully
	Login with invalid credentials
	Login is rejected and an error is displayed
	Waiter selects an available table
	Table can be selected for an order
	Waiter selects an unavailable menu item
	Item cannot be ordered
	Waiter creates an order
	Order is created with status NEW
	New order appears in Kitchen
	Kitchen can see the active order
	Kitchen changes order to Preparing
	Status changes successfully
	Kitchen marks order Ready
	Order becomes ready for serving
	Waiter marks Ready order Served
	Order status changes to SERVED
	Invalid order status transition
	Operation is rejected
	Manager adds a menu item
	Menu item is created
	Manager edits a menu item
	Menu item information is updated
	Manager changes item availability
	Item availability is updated
	Manager creates an employee
	Employee account is created
	Manager removes an employee
	Employee is removed
	Manager generates a bill
	Bill is created with the correct total
	Billing completed
	Table becomes available
	Manager views summary
	Order and earnings information is displayed
	15.3 Role-Based Access Testing
Role restrictions were tested to make sure users cannot perform operations outside their responsibilities.
Operation
	Waiter
	Kitchen
	Manager
	Create Order
	✓
	✗
	✗
	Update Preparation Status
	✓
	✓
	✓
	Manage Menu
	✗
	✗
	✓
	Manage Employees
	✗
	✗
	✓
	Generate Bill
	✗
	✗
	✓
	View Earnings
	✗
	✗
	✓
	The backend also checks the user's role, so restricted operations cannot be accessed simply by changing the frontend screen or URL.
15.4 Order Lifecycle Testing
The order lifecycle was specifically tested because order status is an important part of the application.
The valid sequence is:
NEW
 ↓
PREPARING
 ↓
READY
 ↓
SERVED


The system was checked to ensure that invalid transitions are not allowed.
For example, an order should not directly move from NEW to SERVED without completing the required stages.
15.5 Billing Testing
Billing was tested using served orders.
The test verifies that:
   1. Orders are marked as served.
   2. The Manager can generate the bill.
   3. The bill contains the correct items.
   4. Quantities and prices are correctly included.
   5. The total amount is calculated correctly.
   6. Multiple orders for the same table can be included.
   7. The table becomes available after billing.
15.6 Error and Validation Testing
The application was also checked for common invalid situations, such as:
   * Incorrect login credentials.
   * Missing required fields.
   * API failures.
   * Invalid order status changes.
   * Attempting to access restricted features.
   * Empty data results.
   * Unavailable menu items.
Appropriate error messages or feedback are displayed to help the user understand the problem.
15.7 Testing Result
The testing process verifies the main end-to-end restaurant workflow:
Login
  ↓
Select Table
  ↓
Create Order
  ↓
Kitchen Preparation
  ↓
Order Served
  ↓
Generate Bill
  ↓
Table Available


The application is therefore tested across the major functional areas required for the current KitchenFlow implementation.