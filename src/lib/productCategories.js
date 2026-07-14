const RULES = [
  ['Outerwear', /jacket|coat|blazer|vest|bomber|varsity|windbreaker/i],
  ['Hoodies', /hoodie|hooded/i],
  ['Sweatshirts', /sweatshirt|crewneck/i],
  ['T-Shirts', /t-?shirt|\btee\b/i],
  ['Tops', /sports? bra|crop top|halter|tank|polo/i],
  ['Pants & Sweatpants', /pants|sweatpants|jogger|leggings|trouser/i],
  ['Shorts & Swim', /shorts|swim|trunk/i],
  ['Hats', /cap|hat|snapback|trucker|bucket/i],
  ['Accessories', /bag|tote|sock|belt|scarf|book/i],
  ['Sets', /\bset\b|two-piece|matching/i],
];

export function inferProductCategory(product) {
  const source = `${product.product_type || ''} ${product.title || ''}`;
  return RULES.find(([, pattern]) => pattern.test(source))?.[0] || 'Other';
}
