import { useState, createContext } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [credit, setCredit] = useState(false);
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const loadCreditsData = async () => {
    console.log(isSignedIn,getToken())
    try {
      const token = await getToken();

      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Use Bearer token
        },
      });

      if (data.success) {
        setCredit(data.credits);
        console.log("Credits loaded:", data.credits);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Credits load error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const removeBg = async (image) => {
    try {
      if (!isSignedIn) return openSignIn();

      setImage(image);
      setResultImage(false);
      navigate("/result");

      const token = await getToken();

      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      } else {
        toast.error("No image selected");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/image/remove-bg`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Consistent Bearer token
          },
        }
      );

      if (data.success) {
        setResultImage(data.resultImage);
        if (data.creditBalance !== undefined) setCredit(data.creditBalance);
      } else {
        toast.error(data.message);
        if (data.creditBalance !== undefined) setCredit(data.creditBalance);
        if (data.creditBalance === 0) navigate("/buy");
      }
    } catch (error) {
      console.log("Remove BG error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        credit,
        setCredit,
        loadCreditsData,
        backendUrl,
        image,
        setImage,
        removeBg,
        resultImage,
        setResultImage,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
