import React from "react";
import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";

import DropZone from "../my-component/DropZone";
import FlexBox from "../my-component/FlexBox";
import { H3, Paragraph } from "../my-component/Typography";

const INITIAL_VALUES = {
  order: 10,
  category: "fashion",
  shopName: "SAS Company",
  shopPhone: "+123 4567 8910",
  shopAddress:
    " 208 Đ. Nguyễn Trãi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh.",
  description: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`,
};

const validationSchema = Yup.object().shape({
  shopName: Yup.string().required("Shop Name is required!"),
  shopPhone: Yup.string().required("Shop Phone is required!"),
  category: Yup.string().required("Category is required!"),
  description: Yup.string().required("Description is required!"),
  shopAddress: Yup.string().required("Shop Address is required!"),
  order: Yup.number().required("Orders is required!"),
});

export default function CompanySettings() {
  const [links, setLinks] = React.useState([
    {
      id: 1,
      name: "Links",
      value: "https://www.productbanner.com",
    },
  ]);

  const handleAddLink = () => {
    const newLink = {
      id: Date.now(),
      name: "Links",
      value: "https://www.google.com",
    };
    setLinks((state) => [...state, newLink]);
  };

  const handleDeleteLink = (id) => () => {
    setLinks((state) => state.filter((item) => item.id !== id));
  };

  const handleFormSubmit = (values) => {};

  return (
    <Box py={4} maxWidth={740} margin="auto">
      <H3 mb={2}>Company Settings</H3>

      <Card
        sx={{
          p: 3,
        }}
      >
        <Paragraph fontWeight={700} mb={4}>
          Basic Settings
        </Paragraph>

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={INITIAL_VALUES}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Stack spacing={3} mb={3}>
                <TextField
                  color="info"
                  size="medium"
                  name="shopName"
                  label="Company Name *"
                  onBlur={handleBlur}
                  value={values.shopName}
                  onChange={handleChange}
                  error={Boolean(errors.shopName && touched.shopName)}
                  helperText={touched.shopName && errors.shopName}
                />

                <TextField
                  color="info"
                  size="medium"
                  name="shopPhone"
                  label="Company Phone"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shopPhone}
                  error={Boolean(errors.shopPhone && touched.shopPhone)}
                  helperText={touched.shopPhone && errors.shopPhone}
                />

                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="category"
                  onBlur={handleBlur}
                  placeholder="Category"
                  label="Select Category"
                  onChange={handleChange}
                  value={values.category}
                  error={Boolean(errors.category && touched.category)}
                  helperText={touched.category && errors.category}
                >
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="fashion">Fashion</MenuItem>
                </TextField>

                <TextField
                  rows={6}
                  multiline
                  fullWidth
                  color="info"
                  size="medium"
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  label="Description (optional)"
                  error={Boolean(errors.description && touched.description)}
                  helperText={touched.description && errors.description}
                />

                <TextField
                  color="info"
                  size="medium"
                  name="shopAddress"
                  label="Company Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shopAddress}
                  error={Boolean(errors.shopAddress && touched.shopAddress)}
                  helperText={touched.shopAddress && errors.shopAddress}
                />

                {/* <TextField
                  name="order"
                  color="info"
                  size="medium"
                  type="number"
                  onBlur={handleBlur}
                  value={values.order}
                  label="Minimum Order *"
                  onChange={handleChange}
                  error={Boolean(errors.order && touched.order)}
                  helperText={touched.order && errors.order}
                /> */}
              </Stack>

              <Button type="submit" color="info" variant="contained">
                Save Changes
              </Button>
            </form>
          )}
        </Formik>

        <Divider
          sx={{
            my: 4,
          }}
        />

        <Paragraph fontWeight={700} mb={2}>
          Logo Company Settings
        </Paragraph>

        <Stack spacing={3} mb={3}>
          <DropZone
            onChange={(files) => console.log(files)}
            title="Logo Company (1920 x 360) *"
            imageSize="We had to limit height to maintian consistancy. Some device both side of the banner might cropped for height limitation."
          />

          {/* <TextField
            select
            fullWidth
            color="info"
            size="medium"
            name="features"
            placeholder="Product Features"
            label="Product Features"
            defaultValue="electronics"
          >
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="fashion">Fashion</MenuItem>
          </TextField> */}

          <DropZone
            onChange={(files) => console.log(files)}
            title="All company page banner * (Recommended size 1025x120)"
            imageSize="We had to limit height to maintian consistancy. Some device both side of the banner might cropped for height limitation."
          />
        </Stack>

        <Box mb={4}>
          {links.map((item) => (
            <FlexBox gap={2} alignItems="center" mb={2} key={item.id}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                label="Links"
                defaultValue={item.value}
              />

              <Box flexShrink={0}>
                <IconButton onClick={handleDeleteLink(item.id)}>
                  <Delete
                    sx={{
                      color: "grey.600",
                    }}
                  />
                </IconButton>
              </Box>
            </FlexBox>
          ))}

          <Button color="info" variant="outlined" onClick={handleAddLink}>
            Add Link
          </Button>
        </Box>

        <Button color="info" variant="contained">
          Save Changes
        </Button>
      </Card>
    </Box>
  );
}
