import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request){
  const { searchParams } = new URL(request.url);
  const requested = Number(searchParams.get('size') || 512);
  const size = [180,192,512].includes(requested) ? requested : 512;

  return new ImageResponse(
    <div style={{
      width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',
      background:'linear-gradient(145deg,#17110d 0%,#060504 74%)',position:'relative',overflow:'hidden'
    }}>
      <div style={{position:'absolute',width:'76%',height:'76%',border:'2px solid rgba(255,100,47,.42)',borderRadius:'30%',transform:'rotate(12deg)'}} />
      <div style={{position:'absolute',width:'58%',height:'58%',border:'2px solid rgba(255,100,47,.22)',borderRadius:'50%'}} />
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'66%',height:'66%',borderRadius:'24%',background:'#ff642f',boxShadow:'0 24px 70px rgba(255,100,47,.35)',color:'#100806',fontSize:size*.43,fontFamily:'Arial, sans-serif',fontWeight:900,letterSpacing:'-.08em'}}>B</div>
      <div style={{position:'absolute',bottom:'8%',display:'flex',fontFamily:'Arial, sans-serif',fontSize:Math.max(10,size*.045),fontWeight:900,letterSpacing:Math.max(2,size*.012),color:'#f8f1e7'}}>BODEGA</div>
    </div>,
    { width:size, height:size }
  );
}
