import { useDispatch } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { bagActions } from "../../redux/slices/bagSlice";

const BagItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemoveItem = () => {
    dispatch(bagActions.removeFromBag(item.id));
  };

  return (
    <div className="flex p-4 mb-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
      
      {/* Left: Product Image */}
      <div className="flex-shrink-0 mr-4">
        <img
          src={item.image}
          alt={item.item_name}
          className="w-28 h-28 object-cover rounded-md"
        />
      </div>

      {/* Right: Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-800">{item.company}</div>
          <div className="text-gray-700 mt-1">{item.item_name}</div>

          <div className="flex items-center mt-2 space-x-2">
            <span className="font-bold text-gray-900">Rs {item.current_price}</span>
            <span className="text-gray-400 line-through">Rs {item.original_price}</span>
            <span className="text-green-600 font-medium">({item.discount_percentage}% OFF)</span>
          </div>

          <div className="text-sm text-gray-500 mt-1">
            <span className="font-medium">{item.return_period} days</span> return available
          </div>

          <div className="text-sm text-gray-500 mt-1">
            Delivery by <span className="font-medium">{item.delivery_date}</span>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <div
        className="flex items-start ml-4 cursor-pointer hover:text-red-600 transition-colors duration-200"
        onClick={handleRemoveItem}
      >
        <DeleteIcon fontSize="large" />
      </div>
    </div>
  );
};

export default BagItem;