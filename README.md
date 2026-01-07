# Ebra Store - Full-Stack Developer Assessment

A modern e-commerce storefront built with Next.js 15, TypeScript, and Tailwind CSS, utilizing the Fake Store API for product data.

## Features
- **Home & Shop Pages**: Dynamic product listing with category and price filtering.
- **Product Details**: Dynamic routing (`/product/[id]`) with size selection and real-time countdown.
- **Shopping Cart**: Full cart management using Zustand (Add, Remove, Update Quantity).
- **Responsive Design**: Mobile-first approach using Tailwind CSS.

## Technical Stack
- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Data Source**: Fake Store API

## Installation & Setup

1. **Clone the repository**:
   ```
   git clone <your-repo-url>
   cd ebra-store
   ```
2. **Install dependencies**:
    ```
    npm install
    ```

3. **Environment Variables**: 
No additional .env variables are required for this project as it uses public API endpoints.

4. **Run the development server**:
```
npm run dev
```

5. **Access the App**:
Open http://localhost:3000 in your browser.

## Edge Case Handling
1. **API Errors**: 
Implemented try/catch blocks and Next.js notFound() for invalid product IDs.

2. **Duplicates**: 
The cart store detects existing items and increments quantity rather than duplicating entries.

3. **Safe Removal**: 
The removal logic uses non-destructive filtering to ensure the app remains stable even if an invalid ID is targeted.
