import ProductCatalog from '../../components/ProductCatalog';

// Negate the CustomerLayout main padding so the filter starts flush below the navbar
const CustomerProducts = () => (
    <div className="-mt-6 md:-mt-8 -mx-6 md:-mx-8">
        <ProductCatalog />
    </div>
);

export default CustomerProducts;
