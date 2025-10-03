# Feature Digital - Payment Request Management System

A modern, full-featured payment request management application built with React, TypeScript, and TailwindCSS. This frontend application provides a complete UI for managing payment workflows, ready to integrate with a Laravel backend API.

## 🚀 Features

### Multi-Role System
- **Employees**: Create and track payment requests
- **Finance Managers**: Review and approve/reject department requests
- **Administrators**: Manage users and system-wide settings

### Payment Request Templates
1. **Link Building & Content**: For SEO and content services with line items
2. **Salary Payments**: Employee compensation with detailed breakdowns
3. **Tools & Software**: Subscription and tool purchase requests
4. **Other Work**: General work and service payments

### Key Capabilities
- ✅ Beautiful dark theme with teal-gold gradients
- ✅ Comprehensive form validation
- ✅ File upload support
- ✅ Advanced data tables with search, sort, and pagination
- ✅ Real-time status tracking (Approved/Pending/Rejected)
- ✅ Smooth animations with Framer Motion and AOS
- ✅ Fully responsive design
- ✅ Mock API with automatic fallbacks
- ✅ Role-based navigation and access control

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Animations**: Framer Motion, AOS
- **Forms**: React Hook Form (ready for integration)
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your Laravel API endpoint
# VITE_API_BASE_URL=http://localhost:8000/api

# Start development server
npm run dev
```

## 🎨 Design System

The application uses a sophisticated dark theme with semantic color tokens:

- **Background**: `#0D1215` - Deep dark blue-gray
- **Primary (Buttons)**: `#C59033` - Elegant gold
- **Accent**: `#6FB6AD` - Professional teal
- **Text**: `#E0E0E1` - Soft white
- **Forms**: `#171A1C` - Card background

### Gradient Text
Headings use a beautiful teal-to-gold gradient defined in the design system.

### Status Colors
- **Approved**: Green
- **Pending**: Yellow
- **Rejected**: Red

## 🔌 API Integration

The application is designed to work with a Laravel backend API. All API calls are centralized in `src/lib/api.ts`.

### API Endpoints Expected

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
GET    /api/payment-requests
GET    /api/payment-requests/:id
POST   /api/payment-requests
PUT    /api/payment-requests/:id
POST   /api/payment-requests/:id/approve
POST   /api/payment-requests/:id/reject
POST   /api/files/upload
GET    /api/users
PUT    /api/users/:id/role
```

### Mock Data
The application includes comprehensive mock data fallbacks, allowing full frontend testing without a backend.

## 👥 Demo Accounts

```
Employee:
  Email: john@example.com
  Password: password

Finance Manager:
  Email: jane@example.com
  Password: password

Administrator:
  Email: admin@example.com
  Password: password
```

## 📱 Pages

- **Landing Page** (`/`): Marketing homepage with features and CTA
- **Login** (`/login`): Authentication with mock support
- **Dashboard** (`/dashboard`): Overview with stats and recent requests
- **Create Request** (`/requests/create`): Multi-template form system
- **My Requests** (`/requests`): Data table with search and filters
- **Request Details** (`/requests/:id`): Full request view
- **Department Requests** (`/department`): Finance manager approval interface
- **User Management** (`/admin/users`): Admin role assignment

## 🎭 Key Components

### Reusable UI Components
- `FormInput`: Styled input with label and error handling
- `FormTextarea`: Multi-line input with validation
- `FormSelect`: Dropdown with custom styling
- `FileUploader`: Drag-and-drop file upload
- `StatusBadge`: Color-coded status indicators
- `DataTable`: Advanced table with search, sort, pagination
- `Navbar`: Role-aware navigation
- `BackgroundAnimation`: Subtle animated gradient background

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```

## 📂 Project Structure

```
src/
├── assets/           # Images and static assets
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   └── ...          # Custom components
├── lib/             # Utilities and API services
│   ├── api.ts       # API client and endpoints
│   ├── auth.ts      # Authentication utilities
│   └── utils.ts     # Helper functions
├── pages/           # Route components
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── CreateRequest.tsx
│   ├── Requests.tsx
│   ├── RequestDetails.tsx
│   ├── DepartmentRequests.tsx
│   └── AdminUsers.tsx
└── hooks/           # Custom React hooks
```

## 🔒 Security Features

- Client-side input validation
- Protected routes with authentication guards
- Role-based access control
- Secure file upload handling
- XSS prevention through React's built-in escaping

## 🎯 Next Steps for Backend Integration

1. Update `VITE_API_BASE_URL` in `.env` to point to your Laravel API
2. Ensure Laravel API returns data in the expected format
3. Implement file upload endpoint in Laravel
4. Set up proper CORS configuration
5. Add JWT or Laravel Sanctum authentication
6. Test all API endpoints with the frontend

## 📄 License

This project is proprietary software developed for Feature Digital.

## 🤝 Contributing

This is a private project. Contact the development team for contribution guidelines.

---

Built with ❤️ using React, TypeScript, and TailwindCSS
