# 🎨 Profile Form Frontend

A modern web application built with Next.js that provides real-time user management capabilities through seamless integration with a Rails backend.

---

## 🚀 Tech Stack Overview

### 🔧 Core Technologies
- **Next.js 15.1** with TypeScript - Modern React framework for production-grade applications
- **React 19** - Latest version with enhanced performance and features
- **TypeScript** - For type-safe code and improved developer experience

### 🖌️ UI Components & Styling
- **Shadcn UI**:
  - Built on Radix UI primitives (`@radix-ui/react-*`)
  - Styled with **Tailwind CSS**
  - Supports component variants with **Class Variance Authority**
- **Tailwind CSS** - Utility-first CSS framework with custom configuration (`tailwind.config.ts`)

### ⚡ Real-time Communication
- **ActionCable** - WebSocket integration with Rails backend using `@rails/actioncable`
- Custom WebSocket implementation in `src/lib/actioncable.ts` for real-time updates

---

## 🚜 Deployment

This application uses **Kamal 2** for deployment to EC2 instances. Deployment configuration is specified in `config/deploy.yml`.

### ✅ Prerequisites
1. 🖥️ EC2 instance running
2. 🐳 Docker installed on the server
3. 🛠️ Kamal CLI installed locally

### ⚙️ Deployment Configuration
Found in `config/deploy.yml`:

```yaml
service: agility-automation
  image: iamademar/agility-automation
    servers:
      web:
        X.XXX.XXX.XX
      proxy:
        ssl: true
        host: agilityapp.ademartutor.com
        app_port: 80
```

### 🚀 Deployment Commands
To deploy the application:
```bash
kamal deploy
```

---

## ✨ Notable Feature Implementation

### 🔗 API Integration

The application communicates with a Rails backend API through Next.js API routes (`src/app/api/`).

**Example Routes**:

`src/app/api/user/route.ts`:

```typescript
export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${apiUrl}/users`);
  // Handle response...
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  // Handle request...
}
```

---

### ⚡ Real-time Updates

Real-time functionality is implemented using **ActionCable WebSocket connections**.

`src/lib/actioncable.ts`:

```typescript
const wsUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/cable';
consumer = createConsumer(wsUrl.replace(/^http/, 'ws'));

userUpdatesSubscription = consumer.subscriptions.create('UserUpdatesChannel', {
  connected() {
    console.log('Connected to UserUpdates channel');
  },
  // Handle received updates...
});
```

**Status Page Real-time Listener**:

`src/app/status/page.tsx`:

```typescript
useEffect(() => {
  if (userUpdatesSubscription) {
    userUpdatesSubscription.received = (data: { type: string; user: User }) => {
      if (data.type === 'sync_status_update') {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === data.user.id
              ? { ...user, synced_at: data.user.synced_at }
              : user
          )
        );
      } else if (data.type === 'new_user') {
        setUsers((prevUsers) => [data.user, ...prevUsers]);
      }
    };
  }
}, []);
```

---

## 🔧 Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variables**:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

Build the application:
```bash
npm run build
```

The application is configured for standalone output as defined in `next.config.ts`:

`next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
};
```

This setup ensures optimized deployment with Kamal and Docker.