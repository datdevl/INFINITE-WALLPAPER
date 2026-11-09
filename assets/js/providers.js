const WIKI="https://commons.wikimedia.org/w/api.php";
const NASA="https://images-api.nasa.gov";
async function getJSON(url){const r=await fetch(url,{headers:{"Accept":"application/json"}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}
function plain(s=""){return String(s).replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim()}
function ext(meta,key){return plain(meta?.[key]?.value||"")}
export async function searchCommons(query,kind="image",continuation=null){
 const p=new URLSearchParams({action:"query",format:"json",origin:"*",generator:"search",gsrsearch:`${query} filetype:${kind==="video"?"video":"bitmap"}`,gsrnamespace:"6",gsrlimit:"30",prop:"imageinfo",iiprop:"url|size|extmetadata",iiurlwidth:"2560"});
 if(continuation)Object.entries(continuation).forEach(([k,v])=>p.set(k,v));
 const d=await getJSON(`${WIKI}?${p}`);const pages=Object.values(d.query?.pages||{});
 const items=pages.map(pg=>{const ii=pg.imageinfo?.[0];if(!ii?.url)return null;const m=ii.extmetadata||{},license=ext(m,"LicenseShortName"),author=ext(m,"Artist")||ext(m,"Credit")||"Tác giả trên Wikimedia Commons";const isVideo=/\.(webm|ogv|ogg|mp4)$/i.test(ii.url)||ii.mediatype==="VIDEO";return{id:`commons-${pg.pageid}`,type:isVideo?"video":"photo",url:isVideo?ii.url:(ii.thumburl||ii.url),title:pg.title.replace(/^File:/,""),author,license,source:"Wikimedia Commons",sourceUrl:`https://commons.wikimedia.org/wiki/${encodeURIComponent(pg.title.replace(/ /g,"_"))}`,width:ii.width||0,height:ii.height||0,licenseUrl:ext(m,"LicenseUrl")};}).filter(Boolean);
 return{items,continue:d.continue||null};
}
export async function searchNASA(query,mediaType="image",page=1){
 const d=await getJSON(`${NASA}/search?q=${encodeURIComponent(query)}&media_type=${mediaType}&page=${page}`);
 const items=(d.collection?.items||[]).map(x=>{const m=x.data?.[0]||{},link=x.links?.find(l=>l.rel==="preview")?.href;return{id:`nasa-${m.nasa_id}`,type:mediaType==="video"?"video":"photo",url:link,title:m.title||"NASA media",author:m.center||"NASA",source:"NASA",sourceUrl:m.nasa_id?`https://images.nasa.gov/details/${m.nasa_id}`:"https://images.nasa.gov/",width:0,height:0,nasaId:m.nasa_id,description:m.description};}).filter(x=>x.url);
 return{items,hasMore:(d.collection?.metadata?.total_hits||0)>page*100};
}
export async function getNASAOriginal(item){
 if(!item.nasaId)return item.url;
 try{const d=await getJSON(`${NASA}/asset/${encodeURIComponent(item.nasaId)}`);const links=d.collection?.items||[];const mp4=links.filter(x=>/\.mp4($|\?)/i.test(x.href)).sort((a,b)=>(b.href.length-a.href.length))[0];const image=links.filter(x=>/\.(jpg|jpeg|png|tif|tiff)($|\?)/i.test(x.href));if(item.type==="video"&&mp4)return mp4.href;if(item.type!=="video"&&image.length)return image[image.length-1].href;}catch(e){}return item.url;
}
export async function getPicsum(page=1){const d=await getJSON(`https://picsum.photos/v2/list?page=${page}&limit=50`);return(d||[]).map(x=>({id:`picsum-${x.id}`,type:"photo",url:`https://picsum.photos/id/${x.id}/3840/2160`,title:"Ảnh ngẫu nhiên",author:x.author||"Picsum contributor",source:"Lorem Picsum",sourceUrl:x.url,width:x.width||0,height:x.height||0}));}
