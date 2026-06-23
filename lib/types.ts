export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: SelectedOption[];
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type DetailVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: SelectedOption[];
  image: ProductImage | null;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type ProductDetail = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  images: ProductImage[];
  options: ProductOption[];
  variants: DetailVariant[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: Money;
  };
  featuredImage: ProductImage | null;
  /** Second media image, used for the hover swap. */
  hoverImage: ProductImage | null;
  /** Product options (e.g. Size); placeholder "Title" option filtered out. */
  options: ProductOption[];
  variants: ProductVariant[];
  /** First available variant id — what "Add to Cart" adds by default. */
  defaultVariantId: string | null;
};
