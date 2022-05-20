import { useEffect, useState } from "react";
import "./Login.css";
import { useLocation } from "react-router-dom";
import { db } from "./firebase";
import qs from "query-string";
import { Loader } from "./utils";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function VerifyAccount(props) {
  const parsed = qs.parse(useLocation().search);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    if (parsed && parsed.email && parsed.verification_id) {
      db.collection("email_verification")
        .where("email", "==", parsed.email)
        .orderBy("created_at", "desc")
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            if (
              querySnapshot.docs.length > 0 &&
              querySnapshot.docs[0].data().verification_id ===
                parsed.verification_id
            ) {
              console.log("qweqwe");
              db.collection("email_verification")
                .doc(querySnapshot.docs[0].id)
                .update({ is_verified: true })
                .then((res) => {
                  navigate("/login?verified=true");
                });
            } else {
              console.log("zxczxc");
              Swal.fire({
                icon: "error",
                text: "Invalid verification link!",
              }).then((res) => {
                navigate("/login");
              });
              setIsLoading(false);
            }
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, []);

  return <Loader visible={isLoading} />;
}

export default VerifyAccount;
