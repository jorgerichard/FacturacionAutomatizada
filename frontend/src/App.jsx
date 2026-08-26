import { useEffect, useState } from 'react';
import { buildApiUrl } from './api';

const navItems = [
  { key: 'overview', label: 'Resumen', icon: '📊' },
  { key: 'customers', label: 'Clientes', icon: '👥' },
  { key: 'products', label: 'Productos', icon: '🛒' },
  { key: 'inventory', label: 'Inventario', icon: '📦' },
  { key: 'sales', label: 'Ventas', icon: '💰' },
  { key: 'invoices', label: 'Facturas', icon: '🧾' },
  { key: 'collections', label: 'Cobranzas', icon: '💳' },
  { key: 'receipts', label: 'Boletas', icon: '📄' },
];

function App() {
  const [message, setMessage] = useState('Cargando...');
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bf-token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('bf-token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeView, setActiveView] = useState('overview');
  const [userName, setUserName] = useState('Operador');
  const [userRoles, setUserRoles] = useState([]);
  const [authError, setAuthError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [customerForm, setCustomerForm] = useState({ name: '', rut: '', email: '' });
  const [quotationForm, setQuotationForm] = useState({ customerName: '', productName: '', quantity: '1' });
  const [feedback, setFeedback] = useState('');
  const [invoiceForm, setInvoiceForm] = useState({ customerName: '', total: '0' });
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [orderForm, setOrderForm] = useState({ customerName: '', productName: '', quantity: '1', status: 'Borrador' });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [receiptForm, setReceiptForm] = useState({ invoiceId: '', customerId: '', amount: '0', currency: 'PEN', notes: '' });
  const [receipts, setReceipts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Todos');
  const [inventorySearch, setInventorySearch] = useState('');
  const [receiptSearch, setReceiptSearch] = useState('');
  const [inventoryMovement, setInventoryMovement] = useState({ sku: '', type: 'IN', quantity: '0', notes: '' });
  const [salesSearch, setSalesSearch] = useState('');
  const [salesStatusFilter, setSalesStatusFilter] = useState('Todos');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('Todos');
  const [collectionSearch, setCollectionSearch] = useState('');
  const [collectionStatusFilter, setCollectionStatusFilter] = useState('Todos');
  const [paymentStatusMap, setPaymentStatusMap] = useState({});
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [customerEditForm, setCustomerEditForm] = useState({ name: '', rut: '', email: '' });
  const [editingProductId, setEditingProductId] = useState(null);
  const [productEditForm, setProductEditForm] = useState({ name: '', sku: '', price: '' });
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [invoiceEditForm, setInvoiceEditForm] = useState({ customerName: '', total: '' });

  const isAdmin = userRoles.includes('ADMIN');
  const pendingInvoices = invoices.filter((invoice) => invoice.paymentStatus !== 'Pagada').length;
  const recentCustomers = customers.slice(0, 3);
  const recentProducts = products.slice(0, 3);
  const recentInvoices = invoices.slice(0, 3);

  const filteredCustomers = customers.filter((customer) => {
    const query = customerSearch.toLowerCase().trim();
    if (!query) return true;
    return customer.name.toLowerCase().includes(query) || customer.rut?.toLowerCase().includes(query);
  });

  const productCategories = Array.from(new Set(products.map((product) => product.category || 'Sin categoría')));
  const filteredProducts = products.filter((product) => {
    const query = productSearch.toLowerCase().trim();
    const matchesQuery = !query || product.name.toLowerCase().includes(query) || product.sku?.toLowerCase().includes(query) || (product.category || '').toLowerCase().includes(query);
    const matchesCategory = productCategoryFilter === 'Todos' || (product.category || 'Sin categoría') === productCategoryFilter;
    return matchesQuery && matchesCategory;
  });

  const filteredInventory = inventory.filter((item) => {
    const query = inventorySearch.toLowerCase().trim();
    return !query || item.name.toLowerCase().includes(query) || item.sku?.toLowerCase().includes(query);
  });

  const filteredOrders = orders.filter((order) => {
    const query = salesSearch.toLowerCase().trim();
    const matchesQuery = !query || String(order.id).includes(query) || order.customer.toLowerCase().includes(query) || (order.product || '').toLowerCase().includes(query);
    const matchesStatus = salesStatusFilter === 'Todos' || order.status === salesStatusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredInvoices = invoices.filter((invoice) => {
    const query = invoiceSearch.toLowerCase().trim();
    const matchesQuery = !query || invoice.customerName.toLowerCase().includes(query) || invoice.number?.toLowerCase().includes(query);
    const matchesStatus = invoiceStatusFilter === 'Todos' || invoice.paymentStatus === invoiceStatusFilter;
    return matchesQuery && matchesStatus;
  });

  const collections = invoices.filter((invoice) => invoice.paymentStatus !== 'Pagada');
  const filteredCollections = collections.filter((item) => {
    const query = collectionSearch.toLowerCase().trim();
    const matchesQuery = !query || item.customerName.toLowerCase().includes(query) || item.number?.toLowerCase().includes(query);
    const matchesStatus = collectionStatusFilter === 'Todos' || item.paymentStatus === collectionStatusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredReceipts = receipts.filter((receipt) => {
    const query = receiptSearch.toLowerCase().trim();
    return !query || String(receipt.id).includes(query) || String(receipt.invoiceId).toLowerCase().includes(query) || String(receipt.customerId).toLowerCase().includes(query);
  });

  const summaryCards = [
    {
      label: 'Clientes activos',
      value: dashboard?.customersCount ?? customers.length,
      tone: '#2563eb',
      subtitle: 'Base operativa actual',
    },
    {
      label: 'Productos en catálogo',
      value: dashboard?.productsCount ?? products.length,
      tone: '#0f766e',
      subtitle: 'Disponibles para venta',
    },
    {
      label: 'Facturas pendientes',
      value: dashboard?.pendingInvoicesCount ?? pendingInvoices,
      tone: '#d97706',
      subtitle: 'Requieren seguimiento',
    },
    {
      label: 'Venta mensual',
      value: `$${(dashboard?.monthlySales ?? 0).toLocaleString('es-CL')}`,
      tone: '#7c3aed',
      subtitle: 'Indicador de desempeño',
    },
  ];

  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchWithAuth = async (url, options = {}) => {
    try {
      const response = await fetch(buildApiUrl(url), {
        ...options,
        headers: { ...getAuthHeaders(), ...(options.headers || {}) },
      });

      if (response.status === 401) {
        setStatusError('Sesión inválida. Inicia sesión de nuevo.');
        handleLogout();
      } else if (response.status === 403) {
        setStatusError('No tienes permiso para realizar esta acción.');
      }

      return response;
    } catch (error) {
      setStatusError('No se pudo conectar con el servicio.');
      throw error;
    }
  };

  const handleApiError = (error) => {
    console.error(error);
    setStatusError('No se pudo conectar con el servicio. Intenta de nuevo más tarde.');
  };

  const fetchUserProfile = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetchWithAuth('/api/auth/me');
      if (!response?.ok) {
        return;
      }

      const profile = await response.json();
      setUserName(profile.username.split('@')[0] || 'Operador');
      setUserRoles(profile.roles || []);
    } catch (error) {
      handleApiError(error);
    }
  };

  const refreshData = async () => {
    if (!token) {
      return;
    }

    try {
      const customersResponse = await fetchWithAuth('/api/customers');
      if (customersResponse?.ok) {
        const data = await customersResponse.json();
        setCustomers(data);
      }

      const productsResponse = await fetchWithAuth('/api/products');
      if (productsResponse?.ok) {
        const data = await productsResponse.json();
        setProducts(data);
      }

      const quotationsResponse = await fetchWithAuth('/api/quotations');
      if (quotationsResponse?.ok) {
        const data = await quotationsResponse.json();
        setQuotations(data);
      }

      const invoicesResponse = await fetchWithAuth('/api/invoices');
      if (invoicesResponse?.ok) {
        const data = await invoicesResponse.json();
        setInvoices(data);
      }

      const receiptsResponse = await fetchWithAuth('/api/receipts');
      if (receiptsResponse?.ok) {
        const data = await receiptsResponse.json();
        setReceipts(data);
      }

      const dashboardResponse = await fetchWithAuth('/api/dashboard');
      if (dashboardResponse?.ok) {
        const data = await dashboardResponse.json();
        setDashboard(data);
      }

      const inventoryResponse = await fetchWithAuth('/api/inventory');
      if (inventoryResponse?.ok) {
        const data = await inventoryResponse.json();
        setInventory(data);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetch(buildApiUrl('/api/health'))
      .then((res) => {
        if (res.ok) {
          setMessage('Servicio operativo');
        } else {
          setMessage('Servicio no disponible');
        }
      })
      .catch(() => setMessage('Sin conexión'));

    if (token) {
      setStatusError('');
      fetchUserProfile();
      refreshData();
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const interval = setInterval(() => {
      fetchUserProfile();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);


  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError('');
    setStatusError('');

    if (!email.trim() || !password.trim()) {
      setAuthError('Debes ingresar correo y contraseña');
      return;
    }

    try {
      const response = await fetch(buildApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        setAuthError('Credenciales incorrectas');
        return;
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('bf-token', data.token);
      setIsAuthenticated(true);
      setFeedback('Bienvenido a BusinessFlow');
      await fetchUserProfile();
      await refreshData();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('bf-token');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setActiveView('overview');
    setCustomers([]);
    setProducts([]);
    setQuotations([]);
    setInvoices([]);
    setInventory([]);
    setReceipts([]);
    setDashboard(null);
    setUserRoles([]);
    setStatusError('');
    setAuthError('');
  };

  const handleCreateCustomer = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchWithAuth('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerForm),
      });

      if (response?.ok) {
        const created = await response.json();
        setCustomers((current) => [created, ...current]);
        setCustomerForm({ name: '', rut: '', email: '' });
        setFeedback(`Cliente creado: ${created.name}`);
        setActiveView('customers');
      } else if (response) {
        setStatusError('No fue posible crear el cliente. Verifica tus permisos.');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateQuotation = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchWithAuth('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quotationForm,
          quantity: Number(quotationForm.quantity),
        }),
      });

      if (response?.ok) {
        const created = await response.json();
        setQuotations((current) => [created, ...current]);
        setQuotationForm({ customerName: '', productName: '', quantity: '1' });
        setFeedback(`Cotización creada: ${created.customerName}`);
        setActiveView('quotations');
      } else if (response) {
        setStatusError('No fue posible crear la cotización. Verifica tus permisos.');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateInvoice = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchWithAuth('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: invoiceForm.customerName,
          total: Number(invoiceForm.total),
        }),
      });

      if (response?.ok) {
        const created = await response.json();
        setInvoices((current) => [created, ...current]);
        setInvoiceForm({ customerName: '', total: '0' });
        setFeedback(`Factura emitida: ${created.number}`);
        setActiveView('invoices');
      } else if (response) {
        setStatusError('No fue posible emitir la factura. Verifica tus permisos.');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateReceipt = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchWithAuth('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: receiptForm.invoiceId,
          customerId: receiptForm.customerId,
          amount: Number(receiptForm.amount),
          currency: receiptForm.currency,
          notes: receiptForm.notes,
        }),
      });

      if (response?.ok) {
        const created = await response.json();
        setReceipts((current) => [created, ...current]);
        setReceiptForm({ invoiceId: '', customerId: '', amount: '0', currency: 'PEN', notes: '' });
        setFeedback(`Boleta creada: ${created.id}`);
        setActiveView('receipts');
      } else if (response) {
        setStatusError('No fue posible crear la boleta. Verifica tus permisos.');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleUpdatePaymentStatus = async (invoiceId, paymentStatus) => {
    try {
      const response = await fetchWithAuth(`/api/invoices/${invoiceId}/payment-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });

      if (response?.ok) {
        const updated = await response.json();
        setInvoices((current) => current.map((invoice) => (invoice.id === updated.id ? updated : invoice)));
        setPaymentStatusMap((current) => ({ ...current, [updated.id]: updated.paymentStatus }));
        setFeedback(`Estado de pago actualizado: ${updated.paymentStatus}`);
      } else if (response) {
        setStatusError('No fue posible actualizar el estado de pago. Verifica tus permisos.');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleStartCustomerEdit = (customer) => {
    setEditingCustomerId(customer.id);
    setCustomerEditForm({ name: customer.name, rut: customer.rut, email: customer.email });
  };

  const handleCancelCustomerEdit = () => {
    setEditingCustomerId(null);
    setCustomerEditForm({ name: '', rut: '', email: '' });
  };

  const handleSaveCustomerEdit = async (customerId) => {
    try {
      const response = await fetchWithAuth(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerEditForm),
      });

      if (response?.ok) {
        const updated = await response.json();
        setCustomers((current) => current.map((customer) => (customer.id === updated.id ? updated : customer)));
        setEditingCustomerId(null);
        setCustomerEditForm({ name: '', rut: '', email: '' });
        setFeedback(`Cliente actualizado: ${updated.name}`);
      } else if (response) {
        setStatusError('No fue posible actualizar el cliente.');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleStartProductEdit = (product) => {
    setEditingProductId(product.id);
    setProductEditForm({ name: product.name, sku: product.sku, price: String(product.price) });
  };

  const handleCancelProductEdit = () => {
    setEditingProductId(null);
    setProductEditForm({ name: '', sku: '', price: '' });
  };

  const handleSaveProductEdit = async (productId) => {
    try {
      const response = await fetchWithAuth(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productEditForm,
          price: Number(productEditForm.price),
        }),
      });

      if (response?.ok) {
        const updated = await response.json();
        setProducts((current) => current.map((product) => (product.id === updated.id ? updated : product)));
        setEditingProductId(null);
        setProductEditForm({ name: '', sku: '', price: '' });
        setFeedback(`Producto actualizado: ${updated.name}`);
      } else if (response) {
        setStatusError('No fue posible actualizar el producto.');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleStartInvoiceEdit = (invoice) => {
    setEditingInvoiceId(invoice.id);
    setInvoiceEditForm({ customerName: invoice.customerName, total: String(invoice.total) });
  };

  const handleCancelInvoiceEdit = () => {
    setEditingInvoiceId(null);
    setInvoiceEditForm({ customerName: '', total: '' });
  };

  const handleSaveInvoiceEdit = async (invoiceId) => {
    try {
      const response = await fetchWithAuth(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: invoiceEditForm.customerName, total: Number(invoiceEditForm.total) }),
      });

      if (response?.ok) {
        const updated = await response.json();
        setInvoices((current) => current.map((invoice) => (invoice.id === updated.id ? updated : invoice)));
        setEditingInvoiceId(null);
        setInvoiceEditForm({ customerName: '', total: '' });
        setFeedback(`Factura actualizada: ${updated.number}`);
      } else if (response) {
        setStatusError('No fue posible actualizar la factura.');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const getSectionTitle = () => {
    const item = navItems.find((entry) => entry.key === activeView);
    return item ? item.label : 'Resumen';
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#0b1120', color: '#e2e8f0' }}>
      {!isAuthenticated ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <form
            onSubmit={handleLogin}
            style={{ width: '100%', maxWidth: '440px', background: '#111827', borderRadius: '20px', padding: '2rem', boxShadow: '0 28px 90px rgba(15, 23, 42, 0.25)' }}
          >
            <p style={{ margin: 0, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#818cf8' }}>BusinessFlow</p>
            <h1 style={{ margin: '0.35rem 0 0.5rem', fontSize: '1.8rem', color: '#f8fafc' }}>Accede a tu panel</h1>
            <p style={{ margin: '0 0 1.25rem', color: '#94a3b8' }}>Demo de producto con navegación, métricas y módulos operativos.</p>

            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#e2e8f0' }}>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@empresa.cl"
              style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', marginBottom: '0.9rem', background: '#0f172a', color: '#e2e8f0' }}
            />

            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#e2e8f0' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', marginBottom: '1rem', background: '#0f172a', color: '#e2e8f0' }}
            />

            {authError && (
              <div style={{ marginBottom: '1rem', color: '#dc2626', fontWeight: 600 }}>{authError}</div>
            )}

            <button
              type="submit"
              style={{ width: '100%', border: 'none', borderRadius: '10px', padding: '0.9rem 1rem', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer' }}
            >
              Entrar al panel
            </button>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh' }}>
          <aside style={{ width: 'min(300px, 100%)', background: 'linear-gradient(180deg, #060b16 0%, #0f172a 100%)', color: 'white', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRight: '1px solid rgba(148, 163, 184, 0.16)', boxShadow: '10px 0 40px rgba(15, 23, 42, 0.18)' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65 }}>BusinessFlow</p>
              <h2 style={{ margin: '0.4rem 0 0', fontSize: '1.35rem', lineHeight: 1.1 }}>ERP para PYMEs</h2>
              <p style={{ margin: '0.85rem 0 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Controla clientes, ventas, inventario y cobranzas desde un panel central.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1rem', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Balance</p>
                <strong style={{ display: 'block', marginTop: '0.35rem', fontSize: '1.1rem', color: '#fff' }}>+28%</strong>
              </div>
              <div style={{ width: '56px', height: '56px', display: 'grid', placeItems: 'center', borderRadius: '16px', background: 'rgba(124, 58, 237, 0.16)' }}>
                <span style={{ fontSize: '1.35rem' }}>💹</span>
              </div>
            </div>

            <nav style={{ display: 'grid', gap: '0.5rem' }}>
              {navItems.map((item) => {
                const active = activeView === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveView(item.key)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      border: 'none',
                      borderLeft: active ? '4px solid #7c3aed' : '4px solid transparent',
                      borderRadius: '16px',
                      padding: '0.95rem 1rem',
                      background: active ? 'rgba(124, 58, 237, 0.14)' : 'rgba(255,255,255,0.03)',
                      color: active ? '#ffffff' : '#cbd5e1',
                      cursor: 'pointer',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      transition: 'all 180ms ease',
                    }}
                  >
                    <span style={{ width: '2.3rem', height: '2.3rem', display: 'grid', placeItems: 'center', borderRadius: '999px', background: active ? '#7c3aed' : 'rgba(255,255,255,0.08)', color: active ? '#fff' : '#a5b4fc', fontSize: '1rem' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1.15rem 1rem', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>Conectado como</p>
              <strong style={{ display: 'block', margin: '0.45rem 0 0', fontSize: '1rem', color: '#fff' }}>{userName}</strong>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', opacity: 0.8 }}>Rol: {isAdmin ? 'Administrador' : 'Usuario'}</p>
            </div>
          </aside>

          <main style={{ flex: 1, minHeight: '100vh', width: '100%', padding: '1.5rem 1.75rem', maxWidth: '1440px', margin: '0 auto', background: '#0b1120' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap', padding: '1.5rem', borderRadius: '24px', background: '#111827', border: '1px solid rgba(148, 163, 184, 0.14)', boxShadow: '0 22px 60px rgba(15, 23, 42, 0.06)' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.18)', color: '#e0e7ff', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.55rem', letterSpacing: '0.08em' }}>
                  <span>●</span>
                  Panel operativo BusinessFlow
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>Visión general de ventas, clientes y cobranzas</p>
                <h1 style={{ margin: '0.8rem 0 0', fontSize: '2rem', lineHeight: 1.1 }}>{getSectionTitle()}</h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '0.85rem 1rem', borderRadius: '16px', background: '#111827', border: '1px solid rgba(148, 163, 184, 0.22)', color: '#e2e8f0', fontWeight: 600, minWidth: '170px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Estado</div>
                  <div>{message}</div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '14px', padding: '0.85rem 1.1rem', background: '#1f2937', cursor: 'pointer', fontWeight: 700, color: '#e2e8f0', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.16)' }}
                >
                  Cerrar sesión
                </button>
              </div>
            </header>

            {statusError ? (
              <div style={{ marginBottom: '1rem', padding: '0.9rem 1rem', borderRadius: '10px', background: '#fee2e2', color: '#b91c1c' }}>
                {statusError}
              </div>
            ) : null}
            {feedback ? (
              <div style={{ marginBottom: '1rem', padding: '0.9rem 1rem', borderRadius: '10px', background: '#dcfce7', color: '#166534' }}>
                {feedback}
              </div>
            ) : null}

            {activeView === 'overview' ? (
              <>
                {dashboard ? (
                  <>
                    <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '1.5rem' }}>
                      {summaryCards.map((card) => (
                        <article key={card.label} style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', padding: '1rem', background: '#111827', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.16)' }}>
                          <div style={{ color: card.tone, fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.label}</div>
                          <p style={{ fontSize: '1.55rem', fontWeight: 800, margin: '0.35rem 0 0.2rem', color: '#f8fafc' }}>{card.value}</p>
                          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{card.subtitle}</p>
                        </article>
                      ))}
                    </section>

                    <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1.4fr 1fr', marginBottom: '1.5rem' }}>
                      <article style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', padding: '1.2rem', background: 'linear-gradient(135deg, #111827, #1e293b)', color: 'white' }}>
                        <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Resumen ejecutivo</p>
                        <h2 style={{ margin: '0.35rem 0 0.6rem', fontSize: '1.25rem' }}>Tu operación comercial está más ordenada</h2>
                        <p style={{ margin: 0, lineHeight: 1.6, opacity: 0.92 }}>
                          El panel combina métricas de clientes, facturación y stock para que el equipo tenga una vista rápida del estado del negocio.
                        </p>
                      </article>

                      <article style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', padding: '1.2rem', background: '#111827' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '0.8rem', color: '#f8fafc' }}>Acciones rápidas</h3>
                        <div style={{ display: 'grid', gap: '0.7rem' }}>
                          <div style={{ padding: '0.8rem', borderRadius: '12px', background: '#1e293b', color: '#a5b4fc', fontWeight: 700 }}>Revisar facturas pendientes</div>
                          <div style={{ padding: '0.8rem', borderRadius: '12px', background: '#172554', color: '#60a5fa', fontWeight: 700 }}>Actualizar catálogo de productos</div>
                          <div style={{ padding: '0.8rem', borderRadius: '12px', background: '#1f2937', color: '#fbbf24', fontWeight: 700 }}>Preparar seguimiento a clientes</div>
                        </div>
                      </article>
                    </section>

                    <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                      <article style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', padding: '1rem', background: '#111827' }}>
                        <h3 style={{ marginTop: 0, color: '#f8fafc' }}>Clientes recientes</h3>
                        {recentCustomers.length > 0 ? recentCustomers.map((customer) => (
                          <p key={customer.id} style={{ margin: '0.35rem 0', color: '#cbd5e1' }}>{customer.name}</p>
                        )) : <p style={{ margin: 0, color: '#94a3b8' }}>Sin clientes registrados</p>}
                      </article>
                      <article style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', padding: '1rem', background: '#111827' }}>
                        <h3 style={{ marginTop: 0, color: '#f8fafc' }}>Productos destacados</h3>
                        {recentProducts.length > 0 ? recentProducts.map((product) => (
                          <p key={product.id} style={{ margin: '0.35rem 0', color: '#cbd5e1' }}>{product.name}</p>
                        )) : <p style={{ margin: 0, color: '#94a3b8' }}>Sin productos registrados</p>}
                      </article>
                      <article style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', padding: '1rem', background: '#111827' }}>
                        <h3 style={{ marginTop: 0, color: '#f8fafc' }}>Últimas facturas</h3>
                        {recentInvoices.length > 0 ? recentInvoices.map((invoice) => (
                          <p key={invoice.id} style={{ margin: '0.35rem 0', color: '#cbd5e1' }}>{invoice.number} · {invoice.paymentStatus}</p>
                        )) : <p style={{ margin: 0, color: '#94a3b8' }}>Sin facturas recientes</p>}
                      </article>
                    </section>
                  </>
                ) : (
                  <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '14px', padding: '1rem', background: '#111827', marginBottom: '1.5rem' }}>
                    <h2 style={{ marginTop: 0, color: '#f8fafc' }}>Cargando datos del dashboard...</h2>
                    <p style={{ margin: 0, color: '#94a3b8' }}>Esperando respuesta del servicio para mostrar tus métricas.</p>
                  </section>
                )}
              </>
            ) : null}

            {activeView === 'customers' ? (
              <>
                <div style={{ display: 'grid', gap: '0.8rem', marginBottom: '1rem' }}>
                  <form onSubmit={handleCreateCustomer} style={{ display: 'grid', gap: '0.8rem', border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '14px', padding: '1rem', background: '#111827' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ margin: 0, color: '#f8fafc' }}>Agregar cliente</h2>
                      {!isAdmin && <span style={{ color: '#7c3aed', fontWeight: 700 }}>Solo administradores</span>}
                    </div>
                    <input disabled={!isAdmin} value={customerForm.name} onChange={(event) => setCustomerForm({ ...customerForm, name: event.target.value })} placeholder="Nombre" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                    <input disabled={!isAdmin} value={customerForm.rut} onChange={(event) => setCustomerForm({ ...customerForm, rut: event.target.value })} placeholder="RUT" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                    <input disabled={!isAdmin} value={customerForm.email} onChange={(event) => setCustomerForm({ ...customerForm, email: event.target.value })} placeholder="Correo" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                    <button disabled={!isAdmin} type="submit" style={{ border: 'none', borderRadius: '10px', padding: '0.8rem 1rem', background: isAdmin ? '#2563eb' : '#94a3b8', color: 'white', fontWeight: 700, cursor: isAdmin ? 'pointer' : 'not-allowed' }}>Guardar cliente</button>
                  </form>

                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <input
                      value={customerSearch}
                      onChange={(event) => setCustomerSearch(event.target.value)}
                      placeholder="Buscar por nombre o RUT"
                      style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                    />
                  </div>
                </div>

                <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', overflow: 'hidden', background: '#111827', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)' }}>
                  <div style={{ background: '#111827', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(148, 163, 184, 0.16)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ margin: 0, color: '#f8fafc' }}>Listado de clientes</h2>
                      <p style={{ margin: '0.2rem 0 0', color: '#94a3b8' }}>Seguimiento comercial y contacto principal</p>
                    </div>
                    <span style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: '#172b4d', color: '#a5b4fc', fontWeight: 700 }}>{filteredCustomers.length} registros</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#111827' }}>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Cliente</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>RUT</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Correo</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer) => (
                          editingCustomerId === customer.id ? (
                            <tr key={customer.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                              <td colSpan="4" style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ display: 'grid', gap: '0.6rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                                          <input value={customerEditForm.name} onChange={(event) => setCustomerEditForm({ ...customerEditForm, name: event.target.value })} placeholder="Nombre" style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                                  <input value={customerEditForm.rut} onChange={(event) => setCustomerEditForm({ ...customerEditForm, rut: event.target.value })} placeholder="RUT" style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                                  <input value={customerEditForm.email} onChange={(event) => setCustomerEditForm({ ...customerEditForm, email: event.target.value })} placeholder="Correo" style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <button onClick={() => handleSaveCustomerEdit(customer.id)} style={{ border: 'none', borderRadius: '8px', padding: '0.6rem 0.8rem', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Guardar</button>
                                    <button onClick={handleCancelCustomerEdit} style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '8px', padding: '0.6rem 0.8rem', background: '#1f2937', color: '#e2e8f0', cursor: 'pointer' }}>Cancelar</button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr key={customer.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                              <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{customer.name}</td>
                              <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{customer.rut}</td>
                              <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{customer.email}</td>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <button disabled={!isAdmin} onClick={() => handleStartCustomerEdit(customer)} style={{ border: 'none', borderRadius: '8px', padding: '0.55rem 0.75rem', background: isAdmin ? '#0f766e' : '#94a3b8', color: 'white', cursor: isAdmin ? 'pointer' : 'not-allowed', fontWeight: 600 }}>Editar</button>
                              </td>
                            </tr>
                          )
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : null}

            {activeView === 'products' ? (
              <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', overflow: 'hidden', background: '#111827', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)' }}>
                <div style={{ background: '#111827', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(148, 163, 184, 0.16)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <h2 style={{ margin: 0, color: '#f8fafc' }}>Catálogo de productos</h2>
                      <p style={{ margin: '0.2rem 0 0', color: '#94a3b8' }}>Control comercial y de inventario</p>
                    </div>
                    <span style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: '#172b4d', color: '#a5b4fc', fontWeight: 700 }}>{products.length} productos</span>
                  </div>
                  <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                    <input
                      value={productSearch}
                      onChange={(event) => setProductSearch(event.target.value)}
                      placeholder="Buscar por nombre, SKU o categoría"
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                    />
                    <select
                      value={productCategoryFilter}
                      onChange={(event) => setProductCategoryFilter(event.target.value)}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                    >
                      <option value="Todos">Todos</option>
                      {productCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#0f172a' }}>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Producto</th>
                        <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>SKU</th>
                        <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Precio</th>
                        <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        editingProductId === product.id ? (
                          <tr key={product.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                            <td colSpan="4" style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'grid', gap: '0.6rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                                <input value={productEditForm.name} onChange={(event) => setProductEditForm({ ...productEditForm, name: event.target.value })} placeholder="Nombre" style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                                <input value={productEditForm.sku} onChange={(event) => setProductEditForm({ ...productEditForm, sku: event.target.value })} placeholder="SKU" style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                                <input type="number" min="0" value={productEditForm.price} onChange={(event) => setProductEditForm({ ...productEditForm, price: event.target.value })} placeholder="Precio" style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  <button onClick={() => handleSaveProductEdit(product.id)} style={{ border: 'none', borderRadius: '8px', padding: '0.6rem 0.8rem', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Guardar</button>
                                  <button onClick={handleCancelProductEdit} style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '8px', padding: '0.6rem 0.8rem', background: '#0f172a', color: '#e2e8f0', cursor: 'pointer' }}>Cancelar</button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={product.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{product.name}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{product.sku}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>${product.price.toLocaleString('es-CL')}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <button disabled={!isAdmin} onClick={() => handleStartProductEdit(product)} style={{ border: 'none', borderRadius: '8px', padding: '0.55rem 0.75rem', background: isAdmin ? '#7c3aed' : '#94a3b8', color: 'white', cursor: isAdmin ? 'pointer' : 'not-allowed', fontWeight: 600 }}>Editar</button>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {activeView === 'quotations' ? (
              <>
                <form onSubmit={handleCreateQuotation} style={{ display: 'grid', gap: '0.8rem', border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '14px', padding: '1rem', background: '#111827', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#f8fafc' }}>Crear cotización</h2>
                    {!isAdmin && <span style={{ color: '#7c3aed', fontWeight: 700 }}>Solo administradores</span>}
                  </div>
                  <input disabled={!isAdmin} value={quotationForm.customerName} onChange={(event) => setQuotationForm({ ...quotationForm, customerName: event.target.value })} placeholder="Cliente" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                  <input disabled={!isAdmin} value={quotationForm.productName} onChange={(event) => setQuotationForm({ ...quotationForm, productName: event.target.value })} placeholder="Producto" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                  <input disabled={!isAdmin} type="number" min="1" value={quotationForm.quantity} onChange={(event) => setQuotationForm({ ...quotationForm, quantity: event.target.value })} placeholder="Cantidad" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                  <button disabled={!isAdmin} type="submit" style={{ border: 'none', borderRadius: '10px', padding: '0.8rem 1rem', background: isAdmin ? '#2563eb' : '#94a3b8', color: 'white', fontWeight: 700, cursor: isAdmin ? 'pointer' : 'not-allowed' }}>Guardar cotización</button>
                </form>

                <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', overflow: 'hidden', background: '#111827', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)' }}>
                  <div style={{ background: '#111827', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(148, 163, 184, 0.16)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ margin: 0, color: '#f8fafc' }}>Cotizaciones</h2>
                      <p style={{ margin: '0.2rem 0 0', color: '#94a3b8' }}>Seguimiento de ofertas y montos estimados</p>
                    </div>
                    <span style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: '#172b4d', color: '#a5b4fc', fontWeight: 700 }}>{quotations.length} cotizaciones</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#0f172a' }}>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>#</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Cliente</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Producto</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Cantidad</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotations.map((quotation) => (
                          <tr key={quotation.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>#{quotation.id}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{quotation.customerName}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{quotation.productName}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{quotation.quantity}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>${quotation.total.toLocaleString('es-CL')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : null}

            {activeView === 'sales' ? (
              <>
                <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', overflow: 'hidden', background: '#111827', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)', marginBottom: '1rem' }}>
                  <div style={{ background: '#111827', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(148, 163, 184, 0.16)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <h2 style={{ margin: 0, color: '#f8fafc' }}>Ventas</h2>
                        <p style={{ margin: '0.2rem 0 0', color: '#94a3b8' }}>Órdenes, cotizaciones confirmadas y estados de entrega</p>
                      </div>
                      <span style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: '#172b4d', color: '#a5b4fc', fontWeight: 700 }}>{filteredOrders.length} órdenes</span>
                    </div>
                    <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                      <input
                        value={salesSearch}
                        onChange={(event) => setSalesSearch(event.target.value)}
                        placeholder="Buscar por cliente, pedido o producto"
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                      />
                      <select
                        value={salesStatusFilter}
                        onChange={(event) => setSalesStatusFilter(event.target.value)}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Borrador">Borrador</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Despachada">Despachada</option>
                        <option value="Entregada">Entregada</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ padding: '1rem 1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setShowOrderForm((visible) => !visible)}
                        style={{ border: 'none', borderRadius: '12px', padding: '0.9rem 1rem', background: '#10b981', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                      >
                        {showOrderForm ? 'Ocultar formulario' : 'Crear nueva orden'}
                      </button>
                      <span style={{ color: '#475569' }}>Usa el filtro para encontrar pedidos más rápido.</span>
                    </div>
                    {showOrderForm && (
                      <form onSubmit={(event) => {
                        event.preventDefault();
                        const nextId = orders.length + 1;
                        setOrders((current) => [
                          ...current,
                          {
                            id: nextId,
                            customer: orderForm.customerName || 'Cliente anónimo',
                            product: orderForm.productName || 'Producto no especificado',
                            quantity: Number(orderForm.quantity),
                            total: Number(orderForm.quantity) * 1200,
                            status: orderForm.status,
                          },
                        ]);
                        setOrderForm({ customerName: '', productName: '', quantity: '1', status: 'Borrador' });
                        setShowOrderForm(false);
                        setFeedback('Orden de venta creada.');
                      }} style={{ marginTop: '1rem', display: 'grid', gap: '0.8rem', border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '14px', padding: '1rem', background: '#111827' }}>
                        <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: '1fr 1fr' }}>
                          <input value={orderForm.customerName} onChange={(event) => setOrderForm({ ...orderForm, customerName: event.target.value })} placeholder="Cliente" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                          <input value={orderForm.productName} onChange={(event) => setOrderForm({ ...orderForm, productName: event.target.value })} placeholder="Producto" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                        </div>
                        <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: '1fr 1fr' }}>
                          <input type="number" min="1" value={orderForm.quantity} onChange={(event) => setOrderForm({ ...orderForm, quantity: event.target.value })} placeholder="Cantidad" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                          <select value={orderForm.status} onChange={(event) => setOrderForm({ ...orderForm, status: event.target.value })} style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}>
                            <option value="Borrador">Borrador</option>
                            <option value="Confirmada">Confirmada</option>
                            <option value="Despachada">Despachada</option>
                            <option value="Entregada">Entregada</option>
                          </select>
                        </div>
                        <button type="submit" style={{ width: '180px', border: 'none', borderRadius: '12px', padding: '0.9rem', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Registrar orden</button>
                      </form>
                    )}
                  </div>
                </section>

                <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', overflow: 'hidden', background: '#111827', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)' }}>
                  <div style={{ background: '#111827', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(148, 163, 184, 0.16)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ margin: 0, color: '#f8fafc' }}>Órdenes de venta</h2>
                      <p style={{ margin: '0.2rem 0 0', color: '#94a3b8' }}>Listado de pedidos y estado de proceso</p>
                    </div>
                    <span style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: '#172b4d', color: '#a5b4fc', fontWeight: 700 }}>{filteredOrders.length} registros</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#0f172a' }}>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}># Orden</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Cliente</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Producto</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Total</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>#{order.id}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{order.customer}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{order.product}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>${order.total.toLocaleString('es-CL')}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{ padding: '0.25rem 0.55rem', borderRadius: '999px', background: order.status === 'Entregada' ? '#dcfce7' : '#fef3c7', color: order.status === 'Entregada' ? '#166534' : '#92400e', fontWeight: 700, fontSize: '0.8rem' }}>{order.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : null}

            {activeView === 'invoices' ? (
              <>
                <form onSubmit={handleCreateInvoice} style={{ display: 'grid', gap: '0.8rem', border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '14px', padding: '1rem', background: '#111827', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#f8fafc' }}>Emitir factura</h2>
                    {!isAdmin && <span style={{ color: '#7c3aed', fontWeight: 700 }}>Solo administradores</span>}
                  </div>
                  <input disabled={!isAdmin} value={invoiceForm.customerName} onChange={(event) => setInvoiceForm({ ...invoiceForm, customerName: event.target.value })} placeholder="Cliente" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                  <input disabled={!isAdmin} type="number" min="0" value={invoiceForm.total} onChange={(event) => setInvoiceForm({ ...invoiceForm, total: event.target.value })} placeholder="Total" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                  <button disabled={!isAdmin} type="submit" style={{ border: 'none', borderRadius: '10px', padding: '0.8rem 1rem', background: isAdmin ? '#2563eb' : '#94a3b8', color: 'white', fontWeight: 700, cursor: isAdmin ? 'pointer' : 'not-allowed' }}>Emitir factura</button>
                </form>

                <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', overflow: 'hidden', background: '#111827', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)' }}>
                  <div style={{ background: '#111827', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(148, 163, 184, 0.16)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <h2 style={{ margin: 0, color: '#f8fafc' }}>Facturas</h2>
                        <p style={{ margin: '0.2rem 0 0', color: '#94a3b8' }}>Control de vencimientos y pagos</p>
                      </div>
                      <span style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: '#172b4d', color: '#a5b4fc', fontWeight: 700 }}>{filteredInvoices.length} facturas</span>
                    </div>
                    <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                      <input
                        value={invoiceSearch}
                        onChange={(event) => setInvoiceSearch(event.target.value)}
                        placeholder="Buscar por cliente o número"
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                      />
                      <select
                        value={invoiceStatusFilter}
                        onChange={(event) => setInvoiceStatusFilter(event.target.value)}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Pagada">Pagada</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Vencida">Vencida</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#0f172a' }}>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Documento</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Cliente</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Estado</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Vencimiento</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Total</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices.map((invoice) => {
                          const isOverdue = invoice.paymentStatus !== 'Pagada' && new Date(invoice.dueDate.split('/').reverse().join('-')) < new Date();
                          return editingInvoiceId === invoice.id ? (
                            <tr key={invoice.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                              <td colSpan="6" style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ display: 'grid', gap: '0.6rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                                  <input value={invoiceEditForm.customerName} onChange={(event) => setInvoiceEditForm({ ...invoiceEditForm, customerName: event.target.value })} placeholder="Cliente" style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                                  <input type="number" min="0" value={invoiceEditForm.total} onChange={(event) => setInvoiceEditForm({ ...invoiceEditForm, total: event.target.value })} placeholder="Total" style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }} />
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <button onClick={() => handleSaveInvoiceEdit(invoice.id)} style={{ border: 'none', borderRadius: '8px', padding: '0.6rem 0.8rem', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Guardar</button>
                                    <button onClick={handleCancelInvoiceEdit} style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '8px', padding: '0.6rem 0.8rem', background: '#0f172a', color: '#e2e8f0', cursor: 'pointer' }}>Cancelar</button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr key={invoice.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                              <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{invoice.number}</td>
                              <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{invoice.customerName}</td>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <span style={{ padding: '0.25rem 0.55rem', borderRadius: '999px', background: invoice.paymentStatus === 'Pagada' ? '#dcfce7' : '#fef3c7', color: invoice.paymentStatus === 'Pagada' ? '#166534' : '#92400e', fontWeight: 700, fontSize: '0.8rem' }}>{invoice.paymentStatus}</span>
                              </td>
                              <td style={{ padding: '0.85rem 1rem', color: isOverdue ? '#dc2626' : '#475569' }}>{invoice.dueDate}</td>
                              <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>${invoice.total.toLocaleString('es-CL')}</td>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <button disabled={!isAdmin} onClick={() => handleStartInvoiceEdit(invoice)} style={{ border: 'none', borderRadius: '8px', padding: '0.55rem 0.75rem', background: isAdmin ? '#0f766e' : '#94a3b8', color: 'white', cursor: isAdmin ? 'pointer' : 'not-allowed', fontWeight: 600 }}>Editar</button>
                                  <button onClick={() => handleUpdatePaymentStatus(invoice.id, invoice.paymentStatus === 'Pagada' ? 'Pendiente' : 'Pagada')} style={{ border: 'none', borderRadius: '8px', padding: '0.55rem 0.75rem', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                                    {invoice.paymentStatus === 'Pagada' ? 'Marcar pendiente' : 'Marcar pagada'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : null}

            {activeView === 'collections' ? (
              <>
                <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', overflow: 'hidden', background: '#111827', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)', marginBottom: '1rem' }}>
                  <div style={{ background: '#111827', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(148, 163, 184, 0.16)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <h2 style={{ margin: 0, color: '#f8fafc' }}>Cobranzas</h2>
                        <p style={{ margin: '0.2rem 0 0', color: '#94a3b8' }}>Seguimiento de facturas impagas y acciones de cobro</p>
                      </div>
                      <span style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: '#2c151f', color: '#fda4af', fontWeight: 700 }}>{filteredCollections.length} pendientes</span>
                    </div>
                    <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                      <input
                        value={collectionSearch}
                        onChange={(event) => setCollectionSearch(event.target.value)}
                        placeholder="Buscar por cliente o factura"
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                      />
                      <select
                        value={collectionStatusFilter}
                        onChange={(event) => setCollectionStatusFilter(event.target.value)}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Vencida">Vencida</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', overflow: 'hidden', background: '#111827', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)' }}>
                  <div style={{ background: '#111827', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(148, 163, 184, 0.16)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ margin: 0, color: '#f8fafc' }}>Gestión de cobros</h2>
                      <p style={{ margin: '0.2rem 0 0', color: '#94a3b8' }}>Facturas impagas con estado y próxima acción</p>
                    </div>
                    <span style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: '#0f172a', color: '#a5b4fc', fontWeight: 700 }}>{filteredCollections.length} ítems</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#0f172a' }}>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Factura</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Cliente</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Estado</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Vencimiento</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Total</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCollections.map((invoice) => {
                          const isOverdue = invoice.paymentStatus !== 'Pagada' && new Date(invoice.dueDate.split('/').reverse().join('-')) < new Date();
                          return (
                            <tr key={invoice.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                              <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{invoice.number}</td>
                              <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{invoice.customerName}</td>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <span style={{ padding: '0.25rem 0.55rem', borderRadius: '999px', background: invoice.paymentStatus === 'Pagada' ? '#dcfce7' : '#fee2e2', color: invoice.paymentStatus === 'Pagada' ? '#166534' : '#b91c1c', fontWeight: 700, fontSize: '0.8rem' }}>{invoice.paymentStatus}</span>
                              </td>
                              <td style={{ padding: '0.85rem 1rem', color: isOverdue ? '#dc2626' : '#475569' }}>{invoice.dueDate}</td>
                              <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>${invoice.total.toLocaleString('es-CL')}</td>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <button onClick={() => handleUpdatePaymentStatus(invoice.id, 'Pagada')} style={{ border: 'none', borderRadius: '8px', padding: '0.55rem 0.75rem', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Marcar pagada</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : null}

            {activeView === 'receipts' ? (
              <>
                <form onSubmit={handleCreateReceipt} style={{ display: 'grid', gap: '0.8rem', border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '14px', padding: '1rem', background: '#111827', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#f8fafc' }}>Registrar boleta</h2>
                    {!isAdmin && <span style={{ color: '#7c3aed', fontWeight: 700 }}>Solo administradores</span>}
                  </div>
                  <input disabled={!isAdmin} value={receiptForm.invoiceId} onChange={(event) => setReceiptForm({ ...receiptForm, invoiceId: event.target.value })} placeholder="ID de factura" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                  <input disabled={!isAdmin} value={receiptForm.customerId} onChange={(event) => setReceiptForm({ ...receiptForm, customerId: event.target.value })} placeholder="ID de cliente" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                  <input disabled={!isAdmin} type="number" min="0" value={receiptForm.amount} onChange={(event) => setReceiptForm({ ...receiptForm, amount: event.target.value })} placeholder="Monto" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                  <input disabled={!isAdmin} value={receiptForm.currency} onChange={(event) => setReceiptForm({ ...receiptForm, currency: event.target.value })} placeholder="Moneda" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                  <input disabled={!isAdmin} value={receiptForm.notes} onChange={(event) => setReceiptForm({ ...receiptForm, notes: event.target.value })} placeholder="Notas" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.16)', background: !isAdmin ? '#1f2937' : '#0f172a', color: '#e2e8f0' }} />
                  <button disabled={!isAdmin} type="submit" style={{ border: 'none', borderRadius: '10px', padding: '0.8rem 1rem', background: isAdmin ? '#0f766e' : '#94a3b8', color: 'white', fontWeight: 700, cursor: isAdmin ? 'pointer' : 'not-allowed' }}>Crear boleta</button>
                </form>

                <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', overflow: 'hidden', background: '#111827', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)' }}>
                  <div style={{ background: '#111827', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(148, 163, 184, 0.16)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <h2 style={{ margin: 0, color: '#f8fafc' }}>Boletas</h2>
                        <p style={{ margin: '0.2rem 0 0', color: '#94a3b8' }}>Seguimiento de comprobantes emitidos y su estado</p>
                      </div>
                      <span style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: '#172b4d', color: '#a5b4fc', fontWeight: 700 }}>{filteredReceipts.length} boletas</span>
                    </div>
                    <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                      <input
                        value={receiptSearch}
                        onChange={(event) => setReceiptSearch(event.target.value)}
                        placeholder="Buscar boleta por ID, factura o cliente"
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#475569' }}>Filtra los comprobantes en tiempo real.</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#0f172a' }}>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>ID</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Factura</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Cliente</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Monto</th>
                          <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#334155', fontSize: '0.85rem' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReceipts.map((receipt) => (
                          <tr key={receipt.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{receipt.id}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{receipt.invoiceId}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{receipt.customerId}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{receipt.amount} {receipt.currency}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{ padding: '0.25rem 0.55rem', borderRadius: '999px', background: receipt.status === 'VALIDATED' ? '#dcfce7' : '#fef3c7', color: receipt.status === 'VALIDATED' ? '#166534' : '#92400e', fontWeight: 700, fontSize: '0.8rem' }}>{receipt.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : null}

            {activeView === 'inventory' ? (
              <section style={{ border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '16px', overflow: 'hidden', background: '#111827', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)' }}>
                <div style={{ background: '#111827', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(148, 163, 184, 0.16)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <h2 style={{ margin: 0, color: '#f8fafc' }}>Inventario</h2>
                      <p style={{ margin: '0.2rem 0 0', color: '#94a3b8' }}>Control de stock y movimientos</p>
                    </div>
                    <span style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: '#172b4d', color: '#a5b4fc', fontWeight: 700 }}>{filteredInventory.length} ítems</span>
                  </div>
                  <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem', gridTemplateColumns: '1fr minmax(260px, 1fr)' }}>
                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                      <input
                        value={inventorySearch}
                        onChange={(event) => setInventorySearch(event.target.value)}
                        placeholder="Buscar por producto o SKU"
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                      />
                      <input
                        value={inventoryMovement.sku}
                        onChange={(event) => setInventoryMovement({ ...inventoryMovement, sku: event.target.value })}
                        placeholder="SKU o producto"
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                      />
                      <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: '1fr 1fr' }}>
                        <select
                          value={inventoryMovement.type}
                          onChange={(event) => setInventoryMovement({ ...inventoryMovement, type: event.target.value })}
                          style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                        >
                          <option value="IN">Ingreso</option>
                          <option value="OUT">Salida</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          value={inventoryMovement.quantity}
                          onChange={(event) => setInventoryMovement({ ...inventoryMovement, quantity: event.target.value })}
                          placeholder="Cantidad"
                          style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                        />
                      </div>
                      <input
                        value={inventoryMovement.notes}
                        onChange={(event) => setInventoryMovement({ ...inventoryMovement, notes: event.target.value })}
                        placeholder="Notas del movimiento"
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.16)', background: '#0f172a', color: '#e2e8f0' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const movement = inventoryMovement;
                          if (!movement.sku || Number(movement.quantity) <= 0) {
                            setStatusError('SKU y cantidad son obligatorios para registrar movimiento.');
                            return;
                          }
                          setInventory((current) => current.map((item) => {
                            if (item.sku === movement.sku || item.name.toLowerCase().includes(movement.sku.toLowerCase())) {
                              const newStock = movement.type === 'IN' ? Number(item.stock) + Number(movement.quantity) : Number(item.stock) - Number(movement.quantity);
                              return { ...item, stock: Math.max(newStock, 0) };
                            }
                            return item;
                          }));
                          setInventoryMovement({ sku: '', type: 'IN', quantity: '0', notes: '' });
                          setFeedback('Movimiento de inventario registrado.');
                        }}
                        style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Registrar movimiento
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#0f172a' }}>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Producto</th>
                        <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>SKU</th>
                        <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Stock</th>
                        <th style={{ textAlign: 'left', padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.map((item) => (
                        <tr key={item.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{item.name}</td>
                          <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{item.sku}</td>
                          <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{item.stock}</td>
                          <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>${item.price.toLocaleString('es-CL')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
