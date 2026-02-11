# Campus Billing Admin - Setup Instructions

## 🎯 Quick Start (3 Steps)

### Step 1: Install Node.js
If you don't have Node.js installed:
- Download from: https://nodejs.org/
- Install version 18.x or higher
- Verify: Open terminal and run `node --version`

### Step 2: Install Dependencies
```bash
# Navigate to project folder
cd campus-billing-admin

# Install all required packages
npm install
```

### Step 3: Run the Application
```bash
# Start development server
npm run dev
```

Open your browser and go to: **http://localhost:3000**

## 🔐 Login Credentials (Demo)

Use these emails to test different roles (password: anything)

### Super Admin (Can manage all stores)
```
Email: admin@campus.edu
Password: <any password>
```

### Store Managers (Store-specific access)
```
REC CAFE:   cafe.manager@campus.edu
REC MART:   mart.manager@campus.edu
REC HUT:    hut.manager@campus.edu
6 SENSE:    sense.manager@campus.edu
Password: <any password>
```

## 📁 What You Got

```
campus-billing-admin/
├── README.md              ← Project overview
├── DEVELOPER_GUIDE.md     ← Detailed developer docs
├── SETUP.md              ← This file!
├── package.json          ← Project dependencies
│
├── app/                  ← All pages
│   ├── login/           ← Login page
│   ├── dashboard/       ← Main dashboard
│   └── store/           ← Store management pages
│
├── components/          ← Reusable UI components
│   ├── ui/             ← Buttons, inputs, cards, etc.
│   └── layout/         ← Header, navigation
│
├── context/            ← Global state management
│   └── AppContext.tsx  ← All app logic here
│
├── lib/                ← Helper functions
│   └── mockData.ts     ← Demo data
│
└── types/              ← TypeScript definitions
    └── index.ts
```

## ✅ What's Included

### ✨ Features
- ✅ Admin login system
- ✅ Store selection dashboard
- ✅ Create new stores (Super Admin)
- ✅ Product inventory management
- ✅ Add/edit products
- ✅ Stock status toggles
- ✅ Live order tracking
- ✅ Payment history
- ✅ Revenue analytics
- ✅ Audit logging (tracks all admin actions)
- ✅ Role-based access control

### 🎨 UI Components
- ✅ Professional purple theme
- ✅ Responsive design
- ✅ Clean, modern interface
- ✅ Consistent styling throughout
- ✅ Loading states
- ✅ Success animations

### 🔧 Technical Features
- ✅ TypeScript for type safety
- ✅ React Context for state management
- ✅ LocalStorage for data persistence
- ✅ Next.js 15 (latest version)
- ✅ Tailwind CSS styling
- ✅ Production-ready code structure

## 🚀 Using the Application

### As Super Admin
1. Login with `admin@campus.edu`
2. View dashboard with all stores
3. Click "Add New Store" to create outlets
4. Click "Manage Store" on any store card
5. Add products, manage inventory, view orders

### As Store Manager
1. Login with store-specific email
2. See only your assigned store
3. Manage inventory and view orders
4. Cannot create new stores

## 🔄 How Data Works (Important!)

**Current Setup (Prototype):**
- All data stored in browser's LocalStorage
- Data persists when you refresh the page
- Data is lost if you clear browser cache
- Each browser has separate data

**To reset all data:**
1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Refresh page

**For Production (Later):**
- Replace LocalStorage with a database
- Add real authentication
- Implement API endpoints

## 📝 Modifying the Code

### Adding a New Product Category

1. Open `lib/mockData.ts`
2. Find `STORE_CATEGORIES`
3. Add your category:
```typescript
export const STORE_CATEGORIES = {
  'rec-cafe': ['Beverages', 'Pastries', 'Snacks', 'YOUR_CATEGORY'],
  // ...
};
```

### Changing Colors

1. Open `tailwind.config.js`
2. Update the colors:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
      'primary-dark': '#YOUR_DARK_COLOR',
    },
  },
},
```

### Adding a New Page

1. Create file in `app/` folder
2. Use this template:
```typescript
'use client';

import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';

export default function MyPage() {
  const { currentUser } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">My New Page</h1>
      </div>
    </div>
  );
}
```

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Page doesn't load / blank screen
1. Check browser console (F12) for errors
2. Make sure you're logged in
3. Try clearing LocalStorage: `localStorage.clear()`

### Changes not showing
1. Stop the dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Hard refresh browser (Ctrl+Shift+R)

## 📚 Learning Resources

- **Next.js Tutorial**: https://nextjs.org/learn
- **React Docs**: https://react.dev/learn
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript Basics**: https://www.typescriptlang.org/docs/handbook/intro.html

## 🎓 Recommended Learning Path

1. **Week 1**: Understand React components and state
2. **Week 2**: Learn Next.js routing and pages
3. **Week 3**: Master Tailwind CSS styling
4. **Week 4**: Deep dive into TypeScript
5. **Week 5**: Practice with this codebase

## 💡 Pro Tips

1. **Use the developer guide**: Check `DEVELOPER_GUIDE.md` for detailed examples
2. **Start small**: Modify existing components before creating new ones
3. **Test frequently**: Run the app after each change
4. **Use VS Code**: Get better IntelliSense and error checking
5. **Read the comments**: Code has helpful inline comments

## 🔜 Next Steps

### For Development
1. ✅ Get the app running locally
2. ✅ Test all features with demo credentials
3. ✅ Explore the codebase
4. ⬜ Add your own features
5. ⬜ Customize styling to your needs

### For Production Deployment
1. ⬜ Set up database (PostgreSQL/MongoDB)
2. ⬜ Implement real authentication (JWT)
3. ⬜ Add API routes
4. ⬜ Set up environment variables
5. ⬜ Deploy to Vercel/AWS
6. ⬜ Add payment gateway integration
7. ⬜ Implement real-time updates

## 📞 Support

If you encounter issues:
1. Check the error message in browser console
2. Read `DEVELOPER_GUIDE.md` for detailed docs
3. Search the error on Google/Stack Overflow
4. Check Next.js documentation

## ✨ Features You Can Add

Ideas for extending the application:
- [ ] Export reports to PDF/Excel
- [ ] Email notifications for low stock
- [ ] Analytics dashboard with charts
- [ ] Customer feedback system
- [ ] Inventory alerts
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app version

---

**Happy Coding! 🚀**

Remember: This is a prototype. It's meant to be modified and improved!
