import { Badge, Button, CardMedia } from "@mui/material";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import Axios from "axios";
import { toast } from "react-toastify";

export const AvatarEmployee = ({ userId, edit = true, view = false }) => {
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
    if (edit || view) {
      fetchData();
    }
  }, []);

  async function uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await Axios.post(
        `/api/users/${userId}/upload-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
      return true;
    } catch (err) {
      toast.error(err.message ?? "Have Problem", {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
  }

  async function editFile() {
    const { value: file, isConfirmed } = await Swal.fire({
      title: "Select image",
      input: "file",
      showCancelButton: true,
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
    });

    if (isConfirmed === false) {
      return;
    }
    const data = await uploadFile(file);

    if (data && file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Swal.fire({
          title: "Your uploaded picture",
          imageUrl: e.target.result,
          imageAlt: "The uploaded picture",
        });
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  }

  return (
    <>
      <CardMedia
        style={{
          borderTopLeftRadius: "2%",
          borderTopRightRadius: "2%",
        }}
        sx={{ height: 300 }}
        image={
          !preview && !(edit || view)
            ? `https://www.w3schools.com/w3images/avatar2.png`
            : preview
        }
        title="green iguana"
        loading="lazy"
      />
      {view ? (
        <></>
      ) : (
        <Badge
          badgeContent={
            <Button onClick={editFile} variant="text">
              <EditIcon />
            </Button>
          }
          overlap="circular"
          style={{ transform: "translate(1.5rem, -20px)" }}
        ></Badge>
      )}
    </>
  );
};
