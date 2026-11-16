# Hook: new-page

**Trigger:** When a developer creates a new page component.

**Purpose:** Enforce consistent page structure and Halloween theme application.

## Checklist

1. Create `client/src/pages/MyPage.tsx`.
2. Wrap the page in `<PageWrapper title="Page Title">`.
3. Use `bg-halloween-dark` as the root background (provided by PageWrapper).
4. Add a route entry in `client/src/App.tsx`.
5. Add a nav link in `client/src/components/layout/Sidebar.tsx` if it's a primary page.
6. Fetch data inside the component using the relevant Zustand store or a custom hook.
7. Show a loading skeleton while data is loading.
8. Handle error states with a user-friendly message.

## Page Template

```tsx
import React, { useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useMyStore } from '../store/myStore';

const MyPage: React.FC = () => {
  const { data, isLoading, fetchData } = useMyStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <PageWrapper title="My Page">
        <div className="animate-pulse space-y-4">
          {/* skeleton */}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="My Page">
      <div className="space-y-6">
        {/* page content */}
      </div>
    </PageWrapper>
  );
};

export default MyPage;
```
