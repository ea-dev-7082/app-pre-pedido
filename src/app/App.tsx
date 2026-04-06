import { RouterProvider } from 'react-router';
import { router } from './routes';
import { OrdersProvider } from './contexts/OrdersContext';

export default function App() {
  return (
    <OrdersProvider>
      <RouterProvider router={router} />
    </OrdersProvider>
  );
}
