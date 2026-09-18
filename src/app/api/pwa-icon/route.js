import { ImageResponse } from 'next/og';
export const runtime='edge';
export async function GET(request){
  const requested=Number(new URL(request.url).searchParams.get('size')||512);
  const size=[180,192,512].includes(requested)?requested:512;
  const logo=new URL('/app-logo.png',request.url).toString();
  return new ImageResponse(
    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#060504',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:'5%',borderRadius:'24%',border:'2px solid rgba(255,100,47,.38)'}}/>
      <img src={logo} alt="BODEGA" style={{width:'82%',height:'82%',objectFit:'contain'}}/>
    </div>,{width:size,height:size}
  );
}