export type Product = { id:string; slug:string; name:string; category:string; description:string; price:number; mrp:number; rating:number; reviewCount:number; packSizes:string[]; spiceLevel:string; dishTypes:string[]; region:string; veg:boolean; ingredients:string[]; image:string; badge?:string; stockQuantity?:number; isActive?:boolean; };
export type CartItem = Product & { quantity:number; packSize:string };
export type Recipe = { slug:string; name:string; description:string; time:string; difficulty:string; image:string; cuisine:string; ingredients:string[]; steps:string[]; products:string[] };
export type Review = { id:string; customer:string; rating:number; text:string; product:string; verified:boolean };
export type Combo = { id:string; name:string; description:string; productSlugs:string[]; originalPrice:number; bundlePrice:number; image:string };
