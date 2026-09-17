export default function manifest(){
  return {
    id:'/',
    name:'BODEGA — Culture Department Store',
    short_name:'BODEGA',
    description:'Independent brand rooms, curated apparel, performance, city uniforms and new drops under one roof.',
    start_url:'/?source=pwa',
    scope:'/',
    display:'standalone',
    display_override:['window-controls-overlay','standalone'],
    orientation:'portrait-primary',
    background_color:'#080706',
    theme_color:'#ff642f',
    categories:['shopping','lifestyle'],
    prefer_related_applications:false,
    icons:[
      {src:'/api/pwa-icon?size=192',sizes:'192x192',type:'image/png',purpose:'any'},
      {src:'/api/pwa-icon?size=512',sizes:'512x512',type:'image/png',purpose:'any maskable'}
    ],
    shortcuts:[
      {name:'Shop All',short_name:'Shop',url:'/shop?source=pwa-shortcut'},
      {name:'Brand Rooms',short_name:'Brands',url:'/#rooms'}
    ]
  };
}
