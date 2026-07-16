import {useEffect,useState} from "react";
import api from "./api";
import ProductCard from "./components/ProductCard";
export default function App(){
const [products,setProducts]=useState([]);
const [query,setQuery]=useState("");
const [recs,setRecs]=useState([]);
const [loading,setLoading]=useState(false);
useEffect(()=>{api.get("/products").then(r=>setProducts(r.data));},[]);
const recommend=async()=>{
 setLoading(true);
 try{
 const r=await api.post("/recommend",{query});
 setRecs(r.data.recommendations || []);
 }finally{setLoading(false);}
};
return <div className="container">
<h1>AI Product Recommendation System</h1>
<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="I want a phone under $500"/>
<button onClick={recommend}>Recommend</button>
<h2>Products</h2>
<div className="grid">{products.map(p=><ProductCard key={p.id} p={p}/>)}</div>
<h2>Recommendations</h2>
{loading?"Loading...":
<div className="grid">{recs.map(x=>{
const p=products.find(a=>a.id===x.id);
return p?<ProductCard key={p.id} p={p} reason={x.reason}/>:null;
})}</div>}
</div>;
}