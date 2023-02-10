import { Avatar, Badge, Button, CardMedia } from "@mui/material";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import Axios from "axios";
import { toast } from "react-toastify";

export const AvatarEmployeeIcon = ({ userId }) => {
  const [preview, setPreview] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState();

  React.useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(`/api/users/${userId}/avatar`, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPreview(URL.createObjectURL(new Blob([res.data])));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Avatar
        src={
          !preview ? `https://www.w3schools.com/w3images/avatar2.png` : preview
        }
        style={{
          border: "0.1px solid lightgray",
        }}
        title="green iguana"
        loading="lazy"
      />
    </>
  );
};
