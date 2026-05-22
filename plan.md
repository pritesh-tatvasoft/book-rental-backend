# Plan: Book Rental System - NestJS Implementation

## TL;DR
Build a Book Rental System using NestJS with PostgreSQL for core entities, MongoDB for audit trails, and Supabase for book image storage. Implementation follows 7 phases: database setup → core entities → authentication + user profiles → admin APIs with image upload → user APIs → logging system → payment integration. Each phase builds on previous with explicit dependencies.

---

## Steps

### **Phase 1: Database Setup & Configuration**
1. Install database packages: `@nestjs/typeorm`, `typeorm`, `pg` (PostgreSQL driver), `mongoose`, `@nestjs/mongoose`
2. Create `.env.example` and `.env` files with database credentials:
   - PostgreSQL: connection URL, host, port, username, password, database
   - MongoDB: connection URL or credentials
3. Create `DatabaseModule` that initializes:
   - TypeOrmModule with PostgreSQL connection config (default synchronize: false for production safety)
   - MongooseModule with MongoDB connection config
4. Import both database modules in `AppModule`
5. Test connection: Create a simple health check endpoint that validates both database connections
6. Create database seed script for initial test data
   - *Verification*: Run `npm run start:dev` and check `/health` endpoint returns both databases connected

### **Phase 2: Core Entities & Repositories (PostgreSQL)**
1. Create entity classes in `src/entities/`:
   - **Book** (id, title, author, isbn, availability_count, total_count, description, price, publication_date, image_url, created_at, updated_at)
   - **Customer** (id, email, password_hash, first_name, last_name, phone, address, profile_picture_url, role, created_at, updated_at)
   - **BookRental** (id, customer_id, book_id, rental_date, due_date, return_date, status, late_fee, created_at, updated_at)
2. Create repositories for each entity using TypeORM's Repository pattern
3. Create corresponding services: `BooksService`, `CustomersService`, `BookRentalsService`
4. Add validation using `class-validator` and `class-transformer`
5. *Verification*: Run migrations and verify tables exist in PostgreSQL; test CRUD operations via unit tests

### **Phase 3: Authentication & Authorization** *(depends on Phase 2)*
1. Install JWT packages: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`
2. Create `AuthModule` with:
   - `AuthService`: Register, Login, validateUser, JWT token generation
   - `AuthController`: POST `/auth/register`, POST `/auth/login`
   - JwtStrategy: Validates JWT tokens from Authorization header
   - AuthGuard: Protects routes (extracted from Passport guards)
3. Add role-based access control (RBAC):
   - Add `role` field to Customer entity (ADMIN, USER) — *admin roles pre-configured in database seed only*
   - Create `RolesGuard` to check user roles on endpoints
   - Create `@Roles()` decorator for marking admin-only endpoints
4. Create `ProfileController` for user profile management:
   - **GET** `/api/profile` – Get current user's profile
   - **PUT** `/api/profile` – Update profile (first_name, last_name, phone, address)
   - **POST** `/api/profile/picture` – Upload profile picture to Supabase (returns URL)
5. Create JWT configuration module with expiration times and secrets
6. *Verification*: Test register → login → access protected route flow; verify JWT token validation; upload profile picture and verify URL is stored

### **Phase 4: Admin APIs for Book Management with Image Upload** *(depends on Phase 3)*
1. Install file upload package: `@nestjs/platform-express`, `@types/multer`, `supabase-js` (Supabase SDK)
2. Create Supabase configuration: `src/config/supabase.config.ts` with API key and bucket name
3. Create image upload service: `ImageUploadService` that handles:
   - Upload image to Supabase storage (books-images bucket)
   - Generate public URL for uploaded image
   - Delete old image when updating book
4. Create `BooksController` with admin-only endpoints:
   - **POST** `/api/admin/books` – Create book (title, author, isbn, price, etc.) + upload image file
   - **PUT** `/api/admin/books/:id` – Update book details and/or image
   - **DELETE** `/api/admin/books/:id` – Delete book (and remove image from Supabase)
   - **GET** `/api/admin/books` – List all books with filters (pagination, search by title/author)
   - **PATCH** `/api/admin/books/:id/stock` – Update availability count
5. Add pagination and filtering utilities (limit, offset, search parameters)
6. Add guards: `@UseGuards(AuthGuard('jwt'), RolesGuard)` with `@Roles('ADMIN')` decorator on all endpoints
7. Create DTOs: `CreateBookDto`, `UpdateBookDto` with validation for image file type and size
8. *Verification*: Test all CRUD operations with admin JWT token; upload book image and verify it's in Supabase; verify non-admin access is rejected (403)

### **Phase 5: User APIs (Dashboard, Selection, Rental)** *(depends on Phase 3 & 4)*
1. Create user-facing endpoints in `BooksController`:
   - **GET** `/api/books` – List available books (paginated, searchable, show image_url)
   - **GET** `/api/books/:id` – Get book details with image_url
2. Create `BookRentalsController`:
   - **POST** `/api/rentals` – Rent a book (customer_id, book_id, rental_days)
   - **GET** `/api/rentals` – Get user's rental history (only own rentals)
   - **GET** `/api/rentals/:id` – Get rental details
   - **PATCH** `/api/rentals/:id/return` – Return a book (calculates late fees if overdue)
3. Implement business logic:
   - Check book availability before rental
   - Decrement availability_count when renting
   - Increment availability_count when returning
   - Calculate late fees: (days_overdue × daily_rate)
4. Add response DTOs (Data Transfer Objects) to standardize API responses
5. *Verification*: Test full rental flow: view books with images → rent → return; verify availability updates and late fee calculations

### **Phase 6: Logging & Audit Trail (MongoDB)** *(parallel with Phase 5, depends on Phase 1)*
1. Create `AuditLog` schema in MongoDB:
   - Fields: id, userId, action, entityType, entityId, changes (before/after), timestamp, ipAddress
2. Create `AuditService` that logs:
   - User login/logout events
   - Book rentals and returns
   - Admin actions (create/update/delete books)
   - Failed authorization attempts
3. Create logging interceptor: `LoggingInterceptor` that captures HTTP requests/responses
4. Attach interceptor globally in `AppModule`
5. Add endpoint to retrieve audit logs (admin-only): **GET** `/api/admin/audit-logs` with filters (date range, user, action type)
6. *Verification*: Perform various actions and verify MongoDB contains corresponding audit log entries

### **Phase 7: Payment Integration** *(depends on Phase 5, deferred for later implementation)*
**Status**: Placeholder only — deferred to Phase 7. To be implemented after core rental system is complete.
**Scope**: Integration with payment gateway (Stripe, PayPal, etc.), rental payment processing, late fee settlement, payment history tracking.

---

## Relevant Files

**To Create:**
- `src/config/database.config.ts` – Database connection configuration
- `src/config/supabase.config.ts` – Supabase storage configuration (API key, bucket names)
- `src/database/database.module.ts` – Database initialization module
- `src/entities/book.entity.ts`, `src/entities/customer.entity.ts`, `src/entities/book-rental.entity.ts` – Core entities (includes image_url, profile_picture_url fields)
- `src/modules/auth/auth.module.ts`, `auth.service.ts`, `auth.controller.ts` – Authentication
- `src/modules/profile/profile.module.ts`, `profile.service.ts`, `profile.controller.ts` – User profile management (with picture upload)
- `src/modules/books/books.module.ts`, `books.service.ts`, `books.controller.ts` – Book management with image upload
- `src/modules/rentals/rentals.module.ts`, `rentals.service.ts`, `rentals.controller.ts` – Rental operations
- `src/modules/audit/audit.module.ts`, `audit.service.ts`, `audit.schema.ts` – Audit logging
- `src/services/image-upload.service.ts` – Supabase image upload/delete operations
- `src/guards/roles.guard.ts`, `src/decorators/roles.decorator.ts` – RBAC
- `src/interceptors/logging.interceptor.ts` – Logging interceptor
- `src/dto/` – Data Transfer Objects (CreateBookDto, UpdateBookDto, LoginDto, RentalDto, UpdateProfileDto, etc.)
- `.env.example` – Environment configuration template (includes Supabase credentials)

**To Modify:**
- `src/app.module.ts` – Import DatabaseModule, all feature modules, register ImageUploadService globally
- `src/main.ts` – Add global pipes for validation, error handling middleware if needed
- `package.json` – Add new dependencies (after Phase 1)

---

## Verification

1. **Phase 1**: Run `npm run start:dev` → `/health` endpoint shows "PostgreSQL: connected" and "MongoDB: connected"
2. **Phase 2**: Unit tests for each service CRUD operations pass; database schema verified
3. **Phase 3**: Test workflow: Register new user → Login → Access protected endpoint with JWT; Upload profile picture → Verify URL is stored in database
4. **Phase 4**: Admin creates book with image → Verify image stored in Supabase → Verify image_url in database; Non-admin POST returns 403
5. **Phase 5**: User views book list (shows images) → Rents a book → Verify availability decreases → Returns book → Verify availability increases
6. **Phase 6**: Perform admin/user actions → Verify MongoDB audit_logs contains entries (user_id, action, timestamp)
7. **Phase 7**: Payment integration tests (ready for implementation in later phase)

---

## Decisions

- **PostgreSQL for relational entities**: Books, Customers, BookRentals use TypeORM + PostgreSQL for ACID compliance and relational integrity
- **MongoDB for audit trails**: Activity logs, user actions, and analytics stored in MongoDB for flexible schema and time-series data
- **Supabase for image storage**: Book images and user profile pictures stored in Supabase (scalable, public URLs)
- **User profile fields**: first_name, last_name, phone, address, profile_picture_url (stored in PostgreSQL)
- **Book images field**: Book entity includes image_url field (points to Supabase storage)
- **Admin role management**: Pre-configured only (set in database seed) — no admin management API in Phase 3
- **Role-based access control**: Implemented at guard level for scalability (easy to add more roles)
- **No external authentication providers**: Using native JWT (can add OAuth2/Google login later)
- **Late fees**: Calculated on-demand during return operation
- **Database migrations**: Using TypeORM CLI for version control (not auto-sync in production)
- **Payment integration**: Deferred to Phase 7 — not included in initial MVP

---

## Further Considerations

1. **Environment & Secrets**
   - Should we use a secrets management tool (e.g., AWS Secrets Manager) or keep `.env` file approach for local dev?
   - Recommendation: `.env` for local development; environment variables on production servers

2. **Testing Strategy**
   - Unit tests for services using mocked repositories (included in each phase's verification)
   - E2E tests for complete user flows (rent → return)
   - Test database: separate PostgreSQL and MongoDB instances for testing
   - Should we set up docker-compose for local database containers?

3. **API Documentation & Supabase Setup**
   - Add Swagger/OpenAPI integration (`@nestjs/swagger`) to auto-generate API docs?
   - Recommendation: Defer to later phase, unless needed for frontend team immediately
   - Supabase bucket creation: Need to set up `books-images` and `profile-pictures` buckets with public read access before Phase 3

4. **Payment Integration (Phase 7)**
   - Will implement payment gateway integration (Stripe, PayPal, etc.)
   - Include rental payment processing, late fee settlement, payment history tracking
   - Recommendation: Complete all phases 1-6 before starting payment integration
