import "./ProductCard.css";
export default function ProductCard({p,reason}){return <div className="card"><h3>{p.name}</h3><p>${p.price}</p>{reason&&<small>{reason}</small>}</div>}