# Frontend-Backend Integration Fix

## Summary
Fixed the frontend form submission issue. The "Add Resident" form now correctly calls the backend API with authentication tokens.

---

## What Was Broken ❌
```javascript
// BEFORE: ChildDirectory.jsx - handleAdd() only updated local state
const handleAdd = () => {
  if (!form.name || !form.age || !form.gender) return;
  const initials = form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  
  // PROBLEM: Only updates local state, NO API call
  setChildren((p) => [...p, { ...form, id: p.length + 1, status: "Active", photo: initials }]);
  setShowAdd(false);
  setForm({ name: "", age: "", gender: "", dob: "", admissionDate: "", grade: "", guardian: "", healthStatus: "Good" });
};
```

**Issues:**
- ❌ No axios HTTP client installed
- ❌ No API service layer created
- ❌ No Authorization header with token
- ❌ Form fields don't match backend schema (e.g., "grade" → backend expects "education_level")
- ❌ No error handling
- ❌ No loading states
- ❌ Frontend form isolated from backend

---

## Solution Implemented ✅

### Step 1: Install axios
```bash
npm install axios
```

### Step 2: Create API Client with Auth Interceptor
**File:** `src/api/apiClient.js`
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors (expired token)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 3: Create Child API Service
**File:** `src/api/childService.js`
```javascript
import apiClient from './apiClient';

const childAPI = {
  // Get all children
  getAll: () => apiClient.get('/children'),

  // Get single child by ID
  getById: (id) => apiClient.get(`/children/${id}`),

  // Create new child
  create: (data) => apiClient.post('/children', data),

  // Update child
  update: (id, data) => apiClient.put(`/children/${id}`, data),

  // Delete child (superadmin only)
  delete: (id) => apiClient.delete(`/children/${id}`),
};

export default childAPI;
```

### Step 4: Update AuthPage to Call Backend API
**File:** `src/components/pages/AuthPage.jsx`

**Key Changes:**
- Added `apiClient` import
- Created `handle()` as async function
- POST to `/api/auth/register` or `/api/auth/login`
- Store token in localStorage
- Added error handling and loading states

```javascript
const handle = async () => {
  if (!email || !password) { setError("Please fill in all required fields."); return; }
  if (mode === "signup" && (!name || !org)) { setError("Please fill in all required fields."); return; }
  
  setLoading(true);
  setError("");
  
  try {
    if (mode === "signup") {
      const registerRes = await apiClient.post("/auth/register", {
        email,
        password,
        name,
        organization: org || "CareSync Institution",
        role: "Administrator",
      });
      
      const { token, user } = registerRes.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      onAuth({...user data...});
    } else {
      const loginRes = await apiClient.post("/auth/login", { email, password });
      const { token, user } = loginRes.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      onAuth({...user data...});
    }
  } catch (err) {
    setError(err.response?.data?.message || "Authentication failed.");
  } finally {
    setLoading(false);
  }
};
```

### Step 5: Update ChildDirectory to Call API
**File:** `src/components/pages/ChildDirectory.jsx`

**BEFORE:**
```javascript
const handleAdd = () => {
  if (!form.name || !form.age || !form.gender) return;
  const initials = form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  setChildren((p) => [...p, { ...form, id: p.length + 1, status: "Active", photo: initials }]);
  setShowAdd(false);
  setForm({ name: "", age: "", gender: "", dob: "", admissionDate: "", grade: "", guardian: "", healthStatus: "Good" });
};
```

**AFTER:**
```javascript
import childAPI from "../../api/childService";

const handleAdd = async () => {
  if (!form.name || !form.age || !form.gender) return;
  
  setLoading(true);
  setError("");
  
  try {
    // Map frontend form fields to backend schema
    const childData = {
      name: form.name,
      age: parseInt(form.age),
      gender: form.gender,
      dateOfBirth: form.dob || null,
      admissionDate: form.admissionDate || null,
      education_level: form.grade || null,
      guardianName: form.guardian || null,
      healthStatus: form.healthStatus,
      bloodGroup: "",
      medicalCondition: "",
    };
    
    // Call backend API - Authorization header added automatically!
    const response = await childAPI.create(childData);
    
    // Add returned child to local state
    const newChild = response.data.data;
    const initials = newChild.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    setChildren((p) => [...p, { ...newChild, photo: initials }]);
    
    // Reset form and close modal
    setShowAdd(false);
    setForm({ name: "", age: "", gender: "", dob: "", admissionDate: "", grade: "", guardian: "", healthStatus: "Good" });
  } catch (err) {
    setError(err.response?.data?.message || "Failed to add resident. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

### Step 6: Update App.jsx for Token Persistence
**File:** `src/App.jsx`

**Key Changes:**
- Added `useEffect` import and `useEffect` hook for initialization
- Restore user from localStorage on app load if token exists
- Clear localStorage on logout

```javascript
const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      return null;
    }
  }
  return null;
});

const handleLogout = () => {
  setUser(null);
  localStorage.removeItem('token');  // NEW
  localStorage.removeItem('user');   // NEW
  setScreen('landing');
};
```

---

## How It Now Works 🔄

### Registration Flow:
```
1. User fills form (email, password, name, org)
2. Click "Create Account"
3. AuthPage.handle() called with mode="signup"
4. POST /api/auth/register with form data
5. Backend validates, hashes password, creates user
6. Returns { token, user }
7. Frontend stores token in localStorage
8. User logged in and redirected to app/dashboard
9. Token automatically attached to all future requests
```

### Add Child Flow:
```
1. User on ChildDirectory page
2. Click "Add Resident"
3. Modal form opens
4. User fills: name, age, gender, dob, grade, etc.
5. Click "Add Resident"
6. handleAdd() async function runs
7. Maps form fields to backend schema:
   - "grade" → "education_level"
   - "guardian" → "guardianName"
   - Converts age to integer
8. childAPI.create(mappedData) called
9. axios interceptor adds: Authorization: Bearer <token>
10. POST /api/children with child data
11. Backend validates input (via validators)
12. Creates child in database
13. Returns created child with ID
14. Frontend adds to local state
15. Form clears, modal closes
16. User sees new child in table
17. Child is SAVED TO DATABASE (not just local state!)
```

### Token Attachment:
```javascript
// Every API request automatically includes token:
// Request includes:
// Headers: {
//   Authorization: "Bearer eyJhbGc...ABC123..."
// }

// If token invalid/expired:
// Response 401 → interceptor clears localStorage → redirects to /
```

---

## Files Created/Modified

### Created:
- ✅ `src/api/apiClient.js` - Axios instance with auth interceptor
- ✅ `src/api/childService.js` - Child CRUD API methods

### Modified:
- ✅ `src/components/pages/AuthPage.jsx` - Now calls backend API
- ✅ `src/components/pages/ChildDirectory.jsx` - Now calls backend API
- ✅ `src/App.jsx` - Persists token in localStorage
- ✅ `package.json` - Added axios dependency

---

## Testing Instructions

### 1. Start Both Servers (if not running):
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd react-project
npm run dev
```

### 2. Test Registration:
```
1. Open http://localhost:5173
2. Click "Sign up"
3. Fill: Name, Org, Email, Password (6+ chars)
4. Click "Create Account"
5. Watch Network tab → POST /api/auth/register (201)
6. System stores token in localStorage
7. Redirected to dashboard (logged in)
```

### 3. Test Add Child Form:
```
1. Navigate to "Child Directory" page
2. Click "Add Resident"
3. Fill form:
   - Name: "John Doe"
   - Age: 8
   - Gender: Male
   - DOB: 2015-12-25
   - Admission: 2024-01-15
   - Grade: 3rd
   - Guardian: Jane Doe
   - Health: Good
4. Click "Add Resident"
5. Watch Network tab:
   - POST /api/children (201)
   - Headers include: Authorization: Bearer eyJh...
6. Child appears in table
7. Check PostgreSQL → new row in "child" table
```

### 4. Verify localStorage:
```javascript
// Open DevTools Console and run:
localStorage.getItem('token')        // Shows: "eyJhbGci..."
localStorage.getItem('user')         // Shows: {"name":"...", "email":"..."}
```

### 5. Test Token Persistence:
```
1. Logged in and on dashboard
2. Refresh page (F5)
3. Stay logged in (token restored from localStorage)
4. Close browser and reopen
5. Still logged in (session persisted)
```

### 6. Test Error Handling:
```
1. On Add Child form
2. Leave required field blank
3. Click "Add Resident"
4. Form shows validation error from backend
5. Modal stays open
6. Can try again after fixing
```

---

## Database Integration

### What Gets Saved:
```
When you submit "Add Resident" form:

PostgreSQL table: child (created during Prisma migration)
Columns: id, name, age, gender, dateOfBirth, admissionDate, 
         education_level, guardianName, healthStatus, bloodGroup, 
         medicalCondition, status, user_id, createdAt, updatedAt

New row inserted:
{
  id: 5,
  name: "John Doe",
  age: 8,
  gender: "Male",
  dateOfBirth: "2015-12-25",
  admissionDate: "2024-01-15",
  education_level: "3rd",
  guardianName: "Jane Doe",
  healthStatus: "Good",
  bloodGroup: NULL,
  medicalCondition: NULL,
  status: "Active",
  user_id: 1,
  createdAt: "2025-03-21T10:30:00Z",
  updatedAt: "2025-03-21T10:30:00Z"
}
```

### Verify in Database:
```bash
# Connect to your PostgreSQL (Neon):
psql postgresql://user:pass@...

# List all children:
SELECT * FROM "child";

# Show child structure:
\d child
```

---

## Dependencies Added

```json
{
  "dependencies": {
    "axios": "^1.6.0"  // NEW - HTTP client for API calls
  }
}
```

---

## Key Improvements Made

| Aspect | Before | After |
|--------|--------|-------|
| **HTTP Client** | ❌ None | ✅ axios installed |
| **API Service** | ❌ None | ✅ childService.js with CRUD |
| **Auth Header** | ❌ No token | ✅ Auto-attached via interceptor |
| **Error Handling** | ❌ None | ✅ Try-catch + error messages |
| **Loading States** | ❌ None | ✅ Buttons disabled during requests |
| **Token Persistence** | ❌ Lost on refresh | ✅ Stored in localStorage |
| **Form Integration** | ❌ Local state only | ✅ Full backend sync |
| **Schema Mapping** | ❌ Direct mismatch | ✅ Fields properly mapped |
| **Database Save** | ❌ Never persisted | ✅ Saved to PostgreSQL |

---

## Next Steps

To fully integrate all modules (Staff, Health, Inventory, Expenses), repeat this pattern:

1. Create API services: `staffService.js`, `healthService.js`, `inventoryService.js`, `expenseService.js`
2. Import in respective page components
3. Replace local setState with API calls
4. Map form fields to backend schemas
5. Add error handling and loading states

---

## Testing with Postman (Optional)

Use the existing Postman collection to verify endpoints:
1. Import collection from previous step
2. Register new user
3. Copy token from response
4. Use in Child Collection → Create Child → Headers
5. Set `Authorization: Bearer <token>`
6. Send POST /api/children request
7. Verify child created in database

---

## Questions & Troubleshooting

**Q: Form still shows no network requests?**
- ✅ Verify axios installed: `npm ls axios`
- ✅ Check browser console for errors
- ✅ Ensure backend running on port 5000
- ✅ Check Network tab for CORS errors

**Q: 401 Unauthorized error?**
- Token not in localStorage (login first)
- Token expired (re-login)
- Backend Auth middleware issue (check server logs)

**Q: Form data not matching backend?**
- Check field mapping in handleAdd()
- Compare form fields with Prisma schema
- Use Network tab to see what was sent vs expected

**Q: Changes not persisting after refresh?**
- Ensure token saved to localStorage
- Check if data actually reached PostgreSQL
- Query database directly to verify

