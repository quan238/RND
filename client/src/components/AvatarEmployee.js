import { Badge, Button, CardMedia } from "@mui/material";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

export const AvatarEmployee = () => {
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

  async function editFile() {
    const { value: file } = await Swal.fire({
      title: "Select image",
      input: "file",
      showCancelButton: true,
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
    });

    if (file) {
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
          !preview ? `https://www.w3schools.com/w3images/avatar2.png` : preview
        }
        title="green iguana"
      />
      <Badge
        badgeContent={
          <Button onClick={editFile} variant="text">
            <EditIcon />
          </Button>
        }
        overlap="circular"
        style={{ transform: "translate(1.5rem, -20px)" }}
      ></Badge>
    </>
  );
};
