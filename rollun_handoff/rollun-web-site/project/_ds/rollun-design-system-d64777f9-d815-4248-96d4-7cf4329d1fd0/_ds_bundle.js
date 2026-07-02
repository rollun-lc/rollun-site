/* @ds-bundle: {"format":3,"namespace":"RollunDesignSystem_d64777","components":[],"sourceHashes":{"ui_kits/storefront/App.jsx":"b29cb23116e4","ui_kits/storefront/Bits.jsx":"49a3fa10a005","ui_kits/storefront/CartDrawer.jsx":"de2bf7b1ecfb","ui_kits/storefront/Catalog.jsx":"49c1c983dfd3","ui_kits/storefront/Footer.jsx":"833072d331bc","ui_kits/storefront/Header.jsx":"b0fbc761fc57","ui_kits/storefront/Icons.jsx":"5700bc8cbb7c","ui_kits/storefront/ProductDetail.jsx":"aed934ce3726","ui_kits/storefront/data.js":"df69144bd231"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RollunDesignSystem_d64777 = window.RollunDesignSystem_d64777 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/storefront/App.jsx
try { (() => {
/* Rollun Storefront — app shell & state. */
const {
  useState,
  useMemo
} = React;
function CatalogHero({
  onPickVehicle,
  vehicle
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(100deg,var(--neutral-800),var(--neutral-700))',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '30px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--orange-300)',
      marginBottom: 8
    }
  }, "Automotive \xB7 Powersports \xB7 Health"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 32,
      letterSpacing: '-.02em',
      margin: 0,
      lineHeight: 1.1
    }
  }, "The right part, the first time."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--neutral-300)',
      margin: '10px 0 0',
      maxWidth: 440
    }
  }, "17,000+ parts from 1,000+ brands. Add your vehicle and we'll only show parts that fit.")), /*#__PURE__*/React.createElement("button", {
    onClick: onPickVehicle,
    style: {
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--primary)',
      color: '#fff',
      border: 0,
      borderRadius: 'var(--radius-md)',
      padding: '14px 22px',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 15,
      cursor: 'pointer',
      boxShadow: 'var(--shadow-orange)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: 19
  }), vehicle ? 'Change vehicle' : 'Select your vehicle')), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/rollun-mark.png",
    alt: "",
    style: {
      position: 'absolute',
      right: -30,
      top: -40,
      height: 260,
      opacity: 0.06
    }
  }));
}
function App() {
  const {
    products,
    categories,
    brands,
    vehicles
  } = window.RL_DATA;
  const [view, setView] = useState('catalog'); // catalog | product
  const [active, setActive] = useState(null);
  const [cat, setCat] = useState('All parts');
  const [brandSel, setBrandSel] = useState([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [vehOpen, setVehOpen] = useState(false);
  const [favs, setFavs] = useState({});
  const filtered = useMemo(() => {
    let r = products.filter(p => (cat === 'All parts' || p.cat === cat) && (brandSel.length === 0 || brandSel.includes(p.brand)) && (!query || (p.title + p.brand + p.sku + p.cat).toLowerCase().includes(query.toLowerCase())));
    if (sort === 'price-asc') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') r = [...r].sort((a, b) => b.price - a.price);
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [cat, brandSel, query, sort]);
  function addToCart(p, qty = 1) {
    setCart(c => {
      const ex = c.find(i => i.id === p.id);
      if (ex) return c.map(i => i.id === p.id ? {
        ...i,
        qty: i.qty + qty
      } : i);
      return [...c, {
        ...p,
        qty
      }];
    });
    setCartOpen(true);
  }
  const setQty = (id, q) => setCart(c => q <= 0 ? c.filter(i => i.id !== id) : c.map(i => i.id === id ? {
    ...i,
    qty: q
  } : i));
  const removeItem = id => setCart(c => c.filter(i => i.id !== id));
  const toggleFav = id => setFavs(f => ({
    ...f,
    [id]: !f[id]
  }));
  const openProduct = p => {
    setActive(p);
    setView('product');
    window.scrollTo(0, 0);
  };
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    cartCount: cartCount,
    vehicle: vehicle,
    query: query,
    onQuery: setQuery,
    onOpenCart: () => setCartOpen(true),
    onLogo: () => {
      setView('catalog');
      window.scrollTo(0, 0);
    },
    onPickVehicle: () => setVehOpen(true)
  }), view === 'catalog' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CatalogHero, {
    onPickVehicle: () => setVehOpen(true),
    vehicle: vehicle
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '24px 24px 40px',
      display: 'flex',
      gap: 28,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(FilterRail, {
    data: {
      categories,
      brands
    },
    cat: cat,
    onCat: setCat,
    brandSel: brandSel,
    onBrand: b => setBrandSel(s => s.includes(b) ? s.filter(x => x !== b) : [...s, b])
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18,
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22,
      color: 'var(--fg1)',
      margin: 0
    }
  }, cat), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--fg3)',
      marginTop: 2
    }
  }, filtered.length, " products", vehicle ? ` · fitment: ${vehicle}` : '')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--fg3)'
    }
  }, "Sort"), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      padding: '8px 12px',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-md)',
      background: '#fff',
      color: 'var(--fg1)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "featured"
  }, "Featured"), /*#__PURE__*/React.createElement("option", {
    value: "price-asc"
  }, "Price: low to high"), /*#__PURE__*/React.createElement("option", {
    value: "price-desc"
  }, "Price: high to low"), /*#__PURE__*/React.createElement("option", {
    value: "rating"
  }, "Top rated")))), (brandSel.length > 0 || cat !== 'All parts') && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 16
    }
  }, cat !== 'All parts' && /*#__PURE__*/React.createElement(FilterTag, {
    label: cat,
    onClear: () => setCat('All parts')
  }), brandSel.map(b => /*#__PURE__*/React.createElement(FilterTag, {
    key: b,
    label: b,
    onClear: () => setBrandSel(s => s.filter(x => x !== b))
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 18
    }
  }, filtered.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    product: p,
    onOpen: openProduct,
    onAdd: addToCart,
    fav: !!favs[p.id],
    onFav: toggleFav
  }))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '60px 0',
      textAlign: 'center',
      fontFamily: 'var(--font-sans)',
      color: 'var(--fg3)'
    }
  }, "No parts match those filters.")))) : /*#__PURE__*/React.createElement(ProductDetail, {
    product: active,
    vehicle: vehicle,
    onBack: () => setView('catalog'),
    onAdd: addToCart,
    fav: !!favs[active.id],
    onFav: toggleFav
  }), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(CartDrawer, {
    open: cartOpen,
    items: cart,
    onClose: () => setCartOpen(false),
    onQty: setQty,
    onRemove: removeItem,
    onOpen: p => {
      setCartOpen(false);
      openProduct(p);
    }
  }), /*#__PURE__*/React.createElement(VehicleModal, {
    open: vehOpen,
    vehicles: vehicles,
    onClose: () => setVehOpen(false),
    onPick: v => {
      setVehicle(v);
      setVehOpen(false);
    }
  }));
}
function FilterTag({
  label,
  onClear
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      padding: '6px 8px 6px 12px',
      borderRadius: 'var(--radius-pill)',
      background: '#fff',
      border: '1px solid var(--border-strong)',
      color: 'var(--fg1)'
    }
  }, label, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      color: 'var(--fg3)',
      display: 'flex',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Bits.jsx
try { (() => {
/* Rollun Storefront — shared atoms. */

function Logo({
  height = 30,
  variant = 'color'
}) {
  const src = variant === 'white' ? '../../assets/rollun-logo-white.png' : '../../assets/rollun-logo.png';
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "rollun",
    style: {
      height,
      display: 'block'
    }
  });
}

/* Placeholder product image — honest stand-in (no real photography supplied). */
function ProductImage({
  product,
  height = 200,
  radius = 0
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      borderRadius: radius,
      position: 'relative',
      overflow: 'hidden',
      background: 'repeating-linear-gradient(45deg,#f1f2f2,#f1f2f2 11px,#eceded 11px,#eceded 22px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/rollun-mark.png",
    alt: "",
    style: {
      width: height * 0.3,
      maxWidth: 76,
      opacity: 0.4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 8,
      right: 10,
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '.04em',
      color: 'var(--fg3)',
      textTransform: 'uppercase'
    }
  }, product.cat));
}
function Stars({
  rating,
  size = 13,
  showNum = false,
  reviews
}) {
  const full = Math.round(rating);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Icon, {
    key: i,
    name: "star",
    size: size,
    stroke: 0,
    style: {
      fill: i <= full ? 'var(--primary)' : 'var(--neutral-300)'
    }
  }))), showNum && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size,
      color: 'var(--fg3)',
      fontFamily: 'var(--font-sans)'
    }
  }, rating, " (", reviews, ")"));
}
function StockChip({
  stock,
  text
}) {
  const map = {
    in: {
      bg: 'var(--success-50)',
      fg: 'var(--success-600)',
      dot: 'var(--success-500)'
    },
    low: {
      bg: 'var(--warning-50)',
      fg: 'var(--warning-600)',
      dot: 'var(--warning-500)'
    },
    out: {
      bg: 'var(--danger-50)',
      fg: 'var(--danger-600)',
      dot: 'var(--danger-500)'
    }
  };
  const c = map[stock] || map.in;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11.5,
      fontWeight: 700,
      color: c.fg,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: c.dot
    }
  }), text);
}
function Price({
  price,
  was,
  size = 'md'
}) {
  const sz = {
    sm: 18,
    md: 24,
    lg: 34
  }[size];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: sz,
      letterSpacing: '-.02em',
      color: 'var(--fg1)'
    }
  }, "$", price.toFixed(2)), was && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: sz * 0.55,
      color: 'var(--fg3)',
      textDecoration: 'line-through'
    }
  }, "$", was.toFixed(2)));
}
function Btn({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  full,
  onClick,
  disabled,
  style
}) {
  const pads = {
    sm: '8px 14px',
    md: '11px 20px',
    lg: '15px 26px'
  }[size];
  const fs = {
    sm: 13,
    md: 14,
    lg: 16
  }[size];
  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: fs,
    borderRadius: 'var(--radius-md)',
    padding: pads,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    lineHeight: 1,
    width: full ? '100%' : 'auto',
    transition: 'all var(--dur-base) var(--ease-out)',
    ...style
  };
  const variants = {
    primary: {
      background: 'var(--primary)',
      color: '#fff'
    },
    secondary: {
      background: '#fff',
      color: 'var(--fg1)',
      borderColor: 'var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--fg1)'
    },
    dark: {
      background: 'var(--neutral-800)',
      color: '#fff'
    }
  };
  const dis = {
    background: 'var(--neutral-200)',
    color: 'var(--fg3)',
    borderColor: 'transparent'
  };
  const [h, setH] = React.useState(false);
  let v = {
    ...base,
    ...(disabled ? dis : variants[variant])
  };
  if (h && !disabled) {
    if (variant === 'primary') v = {
      ...v,
      background: 'var(--primary-hover)',
      boxShadow: 'var(--shadow-orange)'
    };else if (variant === 'dark') v = {
      ...v,
      background: 'var(--neutral-900)'
    };else v = {
      ...v,
      background: 'var(--surface-2)'
    };
  }
  return /*#__PURE__*/React.createElement("button", {
    style: v,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: fs + 3
  }), children);
}
function Badge({
  children,
  tone = 'orange'
}) {
  const tones = {
    orange: {
      background: 'var(--primary)',
      color: '#fff'
    },
    dark: {
      background: 'var(--neutral-800)',
      color: '#fff'
    },
    soft: {
      background: 'var(--primary-soft)',
      color: 'var(--orange-700)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      padding: '3px 8px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-sans)',
      ...tones[tone]
    }
  }, children);
}
Object.assign(window, {
  Logo,
  ProductImage,
  Stars,
  StockChip,
  Price,
  Btn,
  Badge
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Bits.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/CartDrawer.jsx
try { (() => {
/* Rollun Storefront — slide-in cart drawer. */

function CartDrawer({
  open,
  items,
  onClose,
  onQty,
  onRemove,
  onOpen
}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const freeAt = 75;
  const pct = Math.min(100, subtotal / freeAt * 100);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(26,28,29,.45)',
      zIndex: 50,
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity var(--dur-base)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: 400,
      maxWidth: '92vw',
      background: '#fff',
      zIndex: 51,
      boxShadow: 'var(--shadow-lg)',
      transform: open ? 'none' : 'translateX(100%)',
      transition: 'transform var(--dur-slow) var(--ease-out)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 20px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cart",
    size: 20,
    style: {
      color: 'var(--fg1)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--fg1)'
    }
  }, "Your cart"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--fg3)'
    }
  }, "(", items.reduce((s, i) => s + i.qty, 0), ")")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      color: 'var(--fg2)',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: 'var(--fg2)',
      marginBottom: 7
    }
  }, subtotal >= freeAt ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--success-600)'
    }
  }, "You've unlocked free shipping")) : /*#__PURE__*/React.createElement("span", null, "Add ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--fg1)'
    }
  }, "$", (freeAt - subtotal).toFixed(2)), " for free shipping")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 3,
      background: 'var(--neutral-200)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: subtotal >= freeAt ? 'var(--success-500)' : 'var(--primary)',
      transition: 'width var(--dur-slow)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 20px'
    }
  }, items.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'var(--fg3)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cart",
    size: 40,
    style: {
      color: 'var(--neutral-300)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 14
    }
  }, "Your cart is empty.")), items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    style: {
      display: 'flex',
      gap: 12,
      padding: '14px 0',
      borderBottom: '1px solid var(--divider)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 66,
      flex: 'none',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      cursor: 'pointer'
    },
    onClick: () => onOpen(it)
  }, /*#__PURE__*/React.createElement(ProductImage, {
    product: it,
    height: 66
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--fg1)',
      lineHeight: 1.3
    }
  }, it.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg3)',
      marginTop: 2
    }
  }, it.sku), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onQty(it.id, it.qty - 1),
    style: miniQty
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 13
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 13
    }
  }, it.qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => onQty(it.id, it.qty + 1),
    style: miniQty
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--fg1)'
    }
  }, "$", (it.price * it.qty).toFixed(2)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onRemove(it.id),
    style: {
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      color: 'var(--fg3)',
      padding: 2,
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 16
  }))))), items.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      borderTop: '1px solid var(--border)',
      boxShadow: '0 -4px 12px rgba(0,0,0,.04)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--fg2)'
    }
  }, "Subtotal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 24,
      letterSpacing: '-.02em',
      color: 'var(--fg1)'
    }
  }, "$", subtotal.toFixed(2))), /*#__PURE__*/React.createElement(Btn, {
    full: true,
    size: "lg"
  }, "Checkout"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: '100%',
      marginTop: 8,
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--fg2)',
      padding: 8
    }
  }, "Continue shopping"))));
}
const miniQty = {
  width: 26,
  height: 26,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 0,
  cursor: 'pointer',
  color: 'var(--fg2)'
};
window.CartDrawer = CartDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/CartDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Catalog.jsx
try { (() => {
/* Rollun Storefront — Catalog: ProductCard, FilterRail, CatalogPage. */

function ProductCard({
  product,
  onOpen,
  onAdd,
  fav,
  onFav
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: '#fff',
      border: `1px solid ${h ? 'var(--border-strong)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: h ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transition: 'all var(--dur-base) var(--ease-out)',
      transform: h ? 'translateY(-2px)' : 'none',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    },
    onClick: () => onOpen(product)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 9,
      left: 9,
      zIndex: 2,
      display: 'flex',
      gap: 6
    }
  }, product.was && /*#__PURE__*/React.createElement(Badge, {
    tone: "dark"
  }, "-", Math.round((1 - product.price / product.was) * 100), "%"), product.best && /*#__PURE__*/React.createElement(Badge, null, "Best seller")), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onFav(product.id);
    },
    style: {
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 2,
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: 'rgba(255,255,255,.92)',
      border: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-xs)',
      color: fav ? 'var(--danger-500)' : 'var(--fg3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 16,
    stroke: fav ? 0 : 2,
    style: {
      fill: fav ? 'var(--danger-500)' : 'none'
    }
  })), /*#__PURE__*/React.createElement(ProductImage, {
    product: product,
    height: 188
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 13px 14px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--fg3)',
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, product.brand), /*#__PURE__*/React.createElement(Stars, {
    rating: product.rating,
    size: 12
  })), /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(product),
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--fg1)',
      lineHeight: 1.32,
      margin: '6px 0 3px'
    }
  }, product.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg3)'
    }
  }, "SKU ", product.sku), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(StockChip, {
    stock: product.stock,
    text: product.stockText
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Price, {
    price: product.price,
    was: product.was,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    full: true,
    size: "sm",
    icon: "cart",
    disabled: product.stock === 'out',
    onClick: () => onAdd(product)
  }, product.stock === 'out' ? 'Backorder' : 'Add to cart'))));
}
function FilterGroup({
  title,
  children,
  open = true
}) {
  const [o, setO] = React.useState(open);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--divider)',
      padding: '14px 0'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setO(!o),
    style: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      padding: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--fg1)',
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, title, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 16,
    style: {
      color: 'var(--fg3)',
      transform: o ? 'none' : 'rotate(-90deg)',
      transition: 'transform var(--dur-fast)'
    }
  })), o && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, children));
}
function Check({
  label,
  count,
  checked,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '4px 0',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--fg2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: onToggle,
    style: {
      width: 17,
      height: 17,
      borderRadius: 4,
      flex: 'none',
      border: `1.5px solid ${checked ? 'var(--primary)' : 'var(--border-strong)'}`,
      background: checked ? 'var(--primary)' : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff'
    }
  }, checked && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12,
    stroke: 3
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: checked ? 'var(--fg1)' : 'var(--fg2)'
    }
  }, label), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--fg3)'
    }
  }, count));
}
function FilterRail({
  data,
  cat,
  onCat,
  brandSel,
  onBrand
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 244,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sliders",
    size: 18,
    style: {
      color: 'var(--fg1)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 17,
      color: 'var(--fg1)'
    }
  }, "Filters")), /*#__PURE__*/React.createElement(FilterGroup, {
    title: "Category"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, data.categories.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => onCat(c),
    style: {
      textAlign: 'left',
      background: cat === c ? 'var(--primary-soft)' : 'transparent',
      border: 0,
      cursor: 'pointer',
      padding: '7px 10px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      fontWeight: cat === c ? 700 : 500,
      color: cat === c ? 'var(--orange-700)' : 'var(--fg2)'
    }
  }, c)))), /*#__PURE__*/React.createElement(FilterGroup, {
    title: "Brand"
  }, data.brands.slice(0, 6).map((b, i) => /*#__PURE__*/React.createElement(Check, {
    key: b,
    label: b,
    count: [212, 540, 96, 1320, 74, 2210][i],
    checked: brandSel.includes(b),
    onToggle: () => onBrand(b)
  }))), /*#__PURE__*/React.createElement(FilterGroup, {
    title: "Price"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "$ Min",
    style: priceInp
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "$ Max",
    style: priceInp
  })), ['Under $25', '$25 – $50', '$50 – $100', '$100 – $250', '$250+'].map(p => /*#__PURE__*/React.createElement(Check, {
    key: p,
    label: p
  }))), /*#__PURE__*/React.createElement(FilterGroup, {
    title: "Rating",
    open: false
  }, [4, 3, 2].map(r => /*#__PURE__*/React.createElement(Check, {
    key: r,
    label: `${r} stars & up`
  }))));
}
const priceInp = {
  width: '50%',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  padding: '8px 10px',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--fg1)'
};
window.ProductCard = ProductCard;
window.FilterRail = FilterRail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Catalog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Footer.jsx
try { (() => {
/* Rollun Storefront — footer + vehicle modal. */

function Footer() {
  const cols = [['Shop', ['Automotive', 'Powersports', 'Health & Wellness', 'Deals', 'Brands']], ['Support', ['Track order', 'Returns', 'Shipping', 'Fitment help', 'Contact us']], ['Company', ['About Rollun', 'Careers', 'Wholesale', 'Affiliates']]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--neutral-800)',
      color: 'var(--neutral-300)',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--neutral-700)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '22px 24px',
      display: 'flex',
      gap: 36,
      flexWrap: 'wrap'
    }
  }, [['truck', 'Free shipping over $75'], ['rotate', '30-day returns'], ['shield', 'Secure checkout'], ['phone', 'US support 1-800-ROLLUN']].map(([ic, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--neutral-100)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 22,
    style: {
      color: 'var(--primary)'
    }
  }), t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '40px 24px 28px',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    height: 30,
    variant: "white"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.6,
      color: 'var(--neutral-400)',
      marginTop: 16,
      maxWidth: 280
    }
  }, "US distributor of automotive parts, powersports gear and health products. Over 17,000 products from 1,000+ trusted brands.")), cols.map(([title, links]) => /*#__PURE__*/React.createElement("div", {
    key: title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: '#fff',
      marginBottom: 14
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--neutral-300)',
      cursor: 'pointer'
    }
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--neutral-700)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10,
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: 'var(--neutral-400)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Rollun LC. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'var(--neutral-400)',
      cursor: 'pointer'
    }
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'var(--neutral-400)',
      cursor: 'pointer'
    }
  }, "Terms"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'var(--neutral-400)',
      cursor: 'pointer'
    }
  }, "Accessibility")))));
}
function VehicleModal({
  open,
  vehicles,
  onPick,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(26,28,29,.5)',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      width: 460,
      maxWidth: '100%',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 22px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: 20,
    style: {
      color: 'var(--primary)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 19,
      color: 'var(--fg1)'
    }
  }, "Select your vehicle"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginLeft: 'auto',
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      color: 'var(--fg3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--fg2)',
      margin: '0 0 16px'
    }
  }, "We'll only show parts guaranteed to fit. Pick a saved vehicle or add a new one."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, vehicles.map(v => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => onPick(v),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      textAlign: 'left',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      background: '#fff',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      fontWeight: 600,
      color: 'var(--fg1)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: 17,
    style: {
      color: 'var(--fg3)'
    }
  }), v, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 16,
    style: {
      color: 'var(--fg3)',
      marginLeft: 'auto'
    }
  })))))));
}
Object.assign(window, {
  Footer,
  VehicleModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Header.jsx
try { (() => {
/* Rollun Storefront — Header: utility bar + main bar + nav + fitment. */

function Header({
  cartCount,
  vehicle,
  onOpenCart,
  onLogo,
  onPickVehicle,
  query,
  onQuery
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--neutral-900)',
      color: 'var(--neutral-300)',
      fontSize: 12.5,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: bar
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "truck",
    size: 15,
    style: {
      color: 'var(--primary)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Free shipping over ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#fff'
    }
  }, "$75"), " \xB7 same-day dispatch on in-stock orders")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 14
  }), "1-800-ROLLUN"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "rotate",
    size: 14
  }), "30-day returns")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--neutral-800)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...bar,
      paddingTop: 14,
      paddingBottom: 14,
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: onLogo,
    style: {
      cursor: 'pointer',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 32,
    variant: "white"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 620,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      padding: '0 14px',
      height: 44
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 18,
    style: {
      color: 'var(--fg3)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => onQuery(e.target.value),
    placeholder: "Search 17,000+ parts \u2014 name, brand, or SKU",
    style: {
      border: 0,
      outline: 'none',
      flex: 1,
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      color: 'var(--fg1)',
      background: 'transparent'
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'var(--primary)',
      color: '#fff',
      border: 0,
      borderRadius: 'var(--radius-sm)',
      padding: '7px 16px',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 13.5,
      cursor: 'pointer'
    }
  }, "Search")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: iconBtn
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: iconBtnLabel
  }, "Account")), /*#__PURE__*/React.createElement("button", {
    style: iconBtn,
    onClick: onOpenCart
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cart",
    size: 20
  }), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: cartBadge
  }, cartCount)), /*#__PURE__*/React.createElement("span", {
    style: iconBtnLabel
  }, "Cart"))))), /*#__PURE__*/React.createElement("nav", {
    style: {
      background: 'var(--neutral-700)',
      borderBottom: '3px solid var(--primary)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...bar,
      paddingTop: 0,
      paddingBottom: 0,
      gap: 4,
      height: 46
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      ...navItem,
      background: 'var(--primary)',
      color: '#fff',
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "menu",
    size: 17
  }), "All departments"), ['Automotive', 'Powersports', 'Health & Wellness', 'Brands', 'Deals'].map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: t,
    style: {
      ...navItem,
      color: i === 4 ? 'var(--orange-300)' : 'var(--neutral-100)'
    }
  }, t)), /*#__PURE__*/React.createElement("a", {
    onClick: onPickVehicle,
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      color: '#fff',
      fontSize: 13.5,
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      background: 'rgba(255,255,255,.08)',
      padding: '7px 14px',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: 16,
    style: {
      color: 'var(--primary)'
    }
  }), vehicle ? /*#__PURE__*/React.createElement("span", null, "Fits: ", /*#__PURE__*/React.createElement("b", null, vehicle)) : /*#__PURE__*/React.createElement("span", null, "Select your vehicle"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 15
  })))));
}
const bar = {
  maxWidth: 1280,
  margin: '0 auto',
  padding: '7px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};
const iconBtn = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  background: 'transparent',
  border: 0,
  color: '#fff',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  padding: '4px 10px'
};
const iconBtnLabel = {
  fontSize: 11,
  fontWeight: 600
};
const cartBadge = {
  position: 'absolute',
  top: -7,
  right: -9,
  background: 'var(--primary)',
  color: '#fff',
  fontSize: 10.5,
  fontWeight: 700,
  minWidth: 17,
  height: 17,
  borderRadius: 9,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
  fontFamily: 'var(--font-sans)'
};
const navItem = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  background: 'transparent',
  border: 0,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  fontSize: 13.5,
  fontWeight: 500,
  padding: '0 14px',
  height: '100%'
};
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Icons.jsx
try { (() => {
/* Rollun Storefront — icon set (Lucide paths, ISC-licensed, inlined). */
function Icon({
  name,
  size = 20,
  stroke = 2,
  style,
  className
}) {
  const P = ICON_PATHS[name] || '';
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: 'none',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: P
    }
  });
}
const ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.43a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  mapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
  phone: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.391"/>',
  badge: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>'
};
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductDetail.jsx
try { (() => {
/* Rollun Storefront — Product detail page with buy-box. */

function ProductDetail({
  product,
  vehicle,
  onBack,
  onAdd,
  fav,
  onFav
}) {
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState('overview');
  const fits = !!vehicle;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '20px 24px 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      fontSize: 13,
      color: 'var(--fg3)',
      fontFamily: 'var(--font-sans)',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: onBack,
    style: {
      cursor: 'pointer',
      color: 'var(--fg2)'
    }
  }, "Catalog"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, product.cat), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg1)'
    }
  }, product.brand)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 320px',
      gap: 28,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(ProductImage, {
    product: product,
    height: 360
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      border: `1px solid ${i === 0 ? 'var(--primary)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(ProductImage, {
    product: product,
    height: 66
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--fg3)',
      textTransform: 'uppercase',
      letterSpacing: '.05em'
    }
  }, product.brand), product.best && /*#__PURE__*/React.createElement(Badge, null, "Best seller")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 27,
      lineHeight: 1.18,
      letterSpacing: '-.02em',
      color: 'var(--fg1)',
      margin: '0 0 10px'
    }
  }, product.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Stars, {
    rating: product.rating,
    size: 15,
    showNum: true,
    reviews: product.reviews
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--fg3)'
    }
  }, "SKU ", product.sku, product.oem ? ` · OEM ${product.oem}` : '')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--fg2)',
      margin: '0 0 20px'
    }
  }, product.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      borderBottom: '1px solid var(--border)',
      marginBottom: 16
    }
  }, [['overview', 'Overview'], ['specs', 'Specs'], ['ship', 'Shipping']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setTab(k),
    style: {
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      padding: '0 0 10px',
      color: tab === k ? 'var(--fg1)' : 'var(--fg3)',
      borderBottom: `2px solid ${tab === k ? 'var(--primary)' : 'transparent'}`,
      marginBottom: -1
    }
  }, l))), tab === 'specs' ? /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("tbody", null, [['Brand', product.brand], ['Part number', product.sku], ['OEM ref', product.oem || '—'], ['Category', product.cat], ['Warranty', '1 year limited'], ['Weight', '2.4 lb']].map(([k, v]) => /*#__PURE__*/React.createElement("tr", {
    key: k,
    style: {
      borderBottom: '1px solid var(--divider)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '9px 0',
      color: 'var(--fg3)',
      width: 140
    }
  }, k), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '9px 0',
      color: 'var(--fg1)',
      fontFamily: k.includes('number') || k.includes('ref') ? 'var(--font-mono)' : 'inherit',
      fontWeight: 500
    }
  }, v))))) : tab === 'ship' ? /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, [['truck', 'Free 2–5 day shipping on orders over $75'], ['package', 'Same-day dispatch on in-stock orders placed by 2pm ET'], ['rotate', '30-day hassle-free returns']].map(([ic, t]) => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: 'flex',
      gap: 11,
      alignItems: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--fg2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18,
    style: {
      color: 'var(--primary)'
    }
  }), t))) : /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.7,
      color: 'var(--fg2)'
    }
  }, /*#__PURE__*/React.createElement("li", null, "Direct OE-fit replacement \u2014 no modification required"), /*#__PURE__*/React.createElement("li", null, "Hardware and fitting instructions included"), /*#__PURE__*/React.createElement("li", null, "Tested to ", product.brand, " quality standards"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 184,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 18,
      boxShadow: 'var(--shadow-sm)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(Price, {
    price: product.price,
    was: product.was,
    size: "lg"
  }), product.was && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 13,
      color: 'var(--success-600)',
      fontWeight: 700,
      fontFamily: 'var(--font-sans)'
    }
  }, "You save $", (product.was - product.price).toFixed(2)), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '14px 0'
    }
  }, /*#__PURE__*/React.createElement(StockChip, {
    stock: product.stock,
    text: product.stockText
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      padding: 12,
      borderRadius: 'var(--radius-md)',
      background: fits ? 'var(--success-50)' : 'var(--warning-50)',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: fits ? 'badge' : 'wrench',
    size: 18,
    style: {
      color: fits ? 'var(--success-500)' : 'var(--warning-600)',
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      lineHeight: 1.4
    }
  }, fits ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--success-600)',
      fontWeight: 600
    }
  }, "Fits your ", vehicle) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--warning-600)',
      fontWeight: 600
    }
  }, "Select a vehicle to confirm fitment"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--fg2)'
    }
  }, "Qty"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(Math.max(1, qty - 1)),
    style: qtyBtn
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      fontWeight: 500
    }
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(qty + 1),
    style: qtyBtn
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  })))), /*#__PURE__*/React.createElement(Btn, {
    full: true,
    size: "lg",
    icon: "cart",
    disabled: product.stock === 'out',
    onClick: () => onAdd(product, qty)
  }, "Add to cart"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 10
    }
  }), /*#__PURE__*/React.createElement(Btn, {
    full: true,
    size: "lg",
    variant: "dark",
    disabled: product.stock === 'out',
    onClick: () => onAdd(product, qty)
  }, "Buy it now"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onFav(product.id),
    style: {
      width: '100%',
      marginTop: 10,
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      fontWeight: 600,
      color: fav ? 'var(--danger-500)' : 'var(--fg2)',
      padding: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 16,
    stroke: fav ? 0 : 2,
    style: {
      fill: fav ? 'var(--danger-500)' : 'none'
    }
  }), fav ? 'Saved' : 'Save for later'), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--divider)',
      marginTop: 14,
      paddingTop: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, [['truck', 'Free shipping over $75'], ['shield', 'Secure checkout'], ['rotate', '30-day returns']].map(([ic, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 9,
      alignItems: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: 'var(--fg2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 15,
    style: {
      color: 'var(--fg3)'
    }
  }), t))))));
}
const qtyBtn = {
  width: 34,
  height: 34,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 0,
  cursor: 'pointer',
  color: 'var(--fg2)'
};
window.ProductDetail = ProductDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/data.js
try { (() => {
/* Rollun Storefront — fake catalog data. Attached to window for the Babel app. */
window.RL_DATA = function () {
  const products = [{
    id: 'p1',
    brand: 'EBC Brakes',
    title: 'Front Brake Pad Set — Severe Duty',
    sku: 'RL-48829-BK',
    cat: 'Brakes',
    dept: 'auto',
    price: 63.20,
    was: 79.00,
    rating: 4.5,
    reviews: 212,
    stock: 'in',
    stockText: 'In stock — ships today',
    best: true,
    hue: 28,
    blurb: 'Aramid-fiber severe-duty pads engineered for high heat and consistent bite. Direct OE replacement with hardware included.'
  }, {
    id: 'p2',
    brand: 'K&N',
    title: 'High-Flow Air Filter — Drop-In',
    sku: 'RL-33-2304',
    oem: '33-2304',
    cat: 'Engine',
    dept: 'auto',
    price: 54.99,
    rating: 4.7,
    reviews: 540,
    stock: 'in',
    stockText: 'In stock — ships today',
    hue: 28,
    blurb: 'Washable, reusable cotton-gauze filter. Up to 50,000 miles between cleanings. Increases airflow over paper filters.'
  }, {
    id: 'p3',
    brand: 'Bilstein',
    title: 'B6 Performance Shock Absorber',
    sku: 'RL-24-186742',
    oem: '24-186742',
    cat: 'Suspension',
    dept: 'auto',
    price: 118.00,
    was: 139.00,
    rating: 4.8,
    reviews: 96,
    stock: 'low',
    stockText: 'Only 3 left',
    hue: 210,
    blurb: 'Monotube gas-pressure shock for sharper handling and control under load. Application-tuned valving.'
  }, {
    id: 'p4',
    brand: 'NGK',
    title: 'Iridium IX Spark Plug (4-pack)',
    sku: 'RL-BKR6EIX-4',
    oem: 'BKR6EIX',
    cat: 'Engine',
    dept: 'auto',
    price: 31.45,
    rating: 4.9,
    reviews: 1320,
    stock: 'in',
    stockText: 'In stock — ships today',
    best: true,
    hue: 28,
    blurb: 'Fine-wire iridium center electrode for quick starts, stable idle and better throttle response.'
  }, {
    id: 'p5',
    brand: 'PIAA',
    title: 'LED Headlight Bulb Kit — 6000K',
    sku: 'RL-26-17395',
    cat: 'Lighting',
    dept: 'auto',
    price: 89.95,
    rating: 4.3,
    reviews: 74,
    stock: 'in',
    stockText: 'In stock — ships today',
    hue: 210,
    blurb: 'Plug-and-play LED conversion with cooling fan. 6000K crisp white output, 12,000 lumen pair.'
  }, {
    id: 'p6',
    brand: 'Mobil 1',
    title: 'Full Synthetic 5W-30 (5 qt)',
    sku: 'RL-120764',
    oem: '120764',
    cat: 'Fluids',
    dept: 'auto',
    price: 28.97,
    rating: 4.9,
    reviews: 2210,
    stock: 'in',
    stockText: 'In stock — ships today',
    hue: 28,
    blurb: 'Advanced full-synthetic engine oil for wear protection and cleaning power up to 10,000 miles.'
  }, {
    id: 'p7',
    brand: 'Optimum Nutrition',
    title: 'Gold Standard Whey — Vanilla, 5 lb',
    sku: 'RL-ON-WHEY5V',
    cat: 'Supplements',
    dept: 'health',
    price: 64.99,
    was: 74.99,
    rating: 4.8,
    reviews: 5400,
    stock: 'in',
    stockText: 'In stock — ships today',
    best: true,
    hue: 150,
    blurb: '24 g protein per serving with 5.5 g BCAAs. Banned-substance tested. Mixes clean with water or milk.'
  }, {
    id: 'p8',
    brand: 'Nordic Naturals',
    title: 'Ultimate Omega-3 — 120 ct',
    sku: 'RL-NN-UO120',
    cat: 'Supplements',
    dept: 'health',
    price: 39.95,
    rating: 4.7,
    reviews: 880,
    stock: 'low',
    stockText: 'Only 4 left',
    hue: 150,
    blurb: '1280 mg omega-3 per serving in triglyceride form for high absorption. Lemon flavor, no fishy aftertaste.'
  }, {
    id: 'p9',
    brand: 'Garmin',
    title: 'Tread Powersports Navigator',
    sku: 'RL-GM-TREAD',
    cat: 'Electronics',
    dept: 'auto',
    price: 399.99,
    rating: 4.4,
    reviews: 61,
    stock: 'in',
    stockText: 'In stock — ships today',
    hue: 210,
    blurb: 'Rugged 5.5" all-terrain GPS for on- and off-road riding. Group ride radio and topo maps built in.'
  }, {
    id: 'p10',
    brand: 'Hydro Flask',
    title: 'Wide-Mouth Insulated Bottle 32 oz',
    sku: 'RL-HF-32WM',
    cat: 'Gear',
    dept: 'health',
    price: 44.95,
    rating: 4.9,
    reviews: 3100,
    stock: 'in',
    stockText: 'In stock — ships today',
    hue: 28,
    blurb: 'TempShield double-wall vacuum insulation keeps drinks cold 24 hrs. Durable powder-coat finish.'
  }, {
    id: 'p11',
    brand: 'Moose Racing',
    title: 'Heavy-Duty Tie-Down Straps (pair)',
    sku: 'RL-MR-3920',
    cat: 'Gear',
    dept: 'auto',
    price: 22.50,
    rating: 4.6,
    reviews: 145,
    stock: 'in',
    stockText: 'In stock — ships today',
    hue: 28,
    blurb: '1.5" soft-loop cam-buckle straps rated to 1,500 lb. Integrated soft ties protect handlebars.'
  }, {
    id: 'p12',
    brand: 'Thera-Band',
    title: 'Resistance Band Set — 3 levels',
    sku: 'RL-TB-SET3',
    cat: 'Recovery',
    dept: 'health',
    price: 18.99,
    rating: 4.5,
    reviews: 420,
    stock: 'out',
    stockText: 'Backorder · 2–3 wks',
    hue: 150,
    blurb: 'Latex resistance bands for rehab and mobility work. Light, medium and heavy resistance included.'
  }];
  const categories = ['All parts', 'Brakes', 'Engine', 'Suspension', 'Lighting', 'Fluids', 'Supplements', 'Gear', 'Electronics', 'Recovery'];
  const brands = ['EBC Brakes', 'K&N', 'Bilstein', 'NGK', 'PIAA', 'Mobil 1', 'Optimum Nutrition', 'Nordic Naturals', 'Garmin'];
  const vehicles = ['2019 Honda CRF250L', '2021 Toyota Tacoma TRD', '2017 Jeep Wrangler JK', '2020 Yamaha YZ450F'];
  return {
    products,
    categories,
    brands,
    vehicles
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/data.js", error: String((e && e.message) || e) }); }

})();
