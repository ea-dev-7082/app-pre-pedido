import { RouterProvider } from 'react-router';
import { router } from './routes';
import { OrdersProvider } from './contexts/OrdersContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <OrdersProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </OrdersProvider>
    </ThemeProvider>
  );
}
