import { useParams, useSearchParams } from "react-router-dom";

function Checkout() {
  const [param] = useSearchParams();

  console.log(param.get("status"));
  return (
    <div>
      <p> Checkout {param.get("status") ?? "N/A"}</p>
    </div>
  );
}

export default Checkout;
