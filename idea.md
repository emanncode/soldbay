# Product note — seller identity on listing cards

Linear's current Product Card specification requires a seller-info row that
displays the seller's username/handle, rating and review count where available,
and a verified or unverified seller indicator. The current mobile
`ProductCard` accepts and displays `sellerName`, defaulting to `@seller`; confirm
that the live API-backed screen supplies the seller username before calling
this complete. The mobile feed currently uses mock products, so end-to-end
display from persisted seller data is not implemented there yet.

Source: AllOnSoldBay Linear project → Component Inventory & Build Order,
Design System Reference, and Feature/Workflow Inventory. This note records the
decision and implementation boundary; it is not a new product requirement.
