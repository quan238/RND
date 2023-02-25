import { Delete, Edit } from "@mui/icons-material";
import {
  Card,
  IconButton,
  Pagination,
  Typography,
  Box,
  Button,
} from "@mui/material";
import TableRow from "../my-component/TableRow";
import FlexBox from "../my-component/FlexBox";
import { H5 } from "../my-component/Typography";

const PaymentMethods = () => {
  // SECTION TITLE HEADER LINK

  return (
    <Box py={4} maxWidth={740} margin="auto">
      {/* TITLE HEADER AREA */}
      <FlexBox className="justify-content-lg-between  w-100 mb-5">
        <h5>Setting Payment Methods</h5>
        <Button variant="contained">Add new Payment Method</Button>
      </FlexBox>
      {/* ALL PAYMENT LIST AREA */}
      {paymentMethods.map((item, ind) => (
        <TableRow
          sx={{
            my: "1rem",
            padding: "6px 18px",
          }}
          key={ind}
        >
          <FlexBox alignItems="center" m={0.75}>
            <Card
              sx={{
                width: 42,
                height: 28,
                mr: "10px",
                borderRadius: "2px",
              }}
            >
              <img
                src={`/assets/images/payment-methods/${item.payment_method}.svg`}
                alt={item.payment_method}
                width="100%"
              />
            </Card>

            <H5 whiteSpace="pre" m={0.75}>
              Ralf Edward
            </H5>
          </FlexBox>

          <Typography whiteSpace="pre" m={0.75}>
            {item.card_no}
          </Typography>

          <Typography whiteSpace="pre" m={0.75}>
            {item.exp}
          </Typography>

          <Typography whiteSpace="pre" textAlign="center" color="grey.600">
            <a href="/payment-methods/xkssThds6h37sd" passHref>
              <IconButton>
                <Edit fontSize="small" color="inherit" />
              </IconButton>
            </a>

            <IconButton onClick={(e) => e.stopPropagation()}>
              <Delete fontSize="small" color="inherit" />
            </IconButton>
          </Typography>
        </TableRow>
      ))}

      {/* PAGINATION AREA */}
      <FlexBox justifyContent="center" mt={5}>
        <Pagination count={5} onChange={(data) => console.log(data)} />
      </FlexBox>
    </Box>
  );
};

const paymentMethods = [
  {
    id: "1050017AS",
    exp: "08 / 2022",
    payment_method: "Amex",
    card_no: "1234 **** **** ****",
  },
  {
    id: "1050017AS",
    exp: "10 / 2025",
    payment_method: "Mastercard",
    card_no: "1234 **** **** ****",
  },
  {
    id: "1050017AS",
    exp: "N/A",
    payment_method: "PayPal",
    card_no: "ui-lib@email.com",
  },
  {
    id: "1050017AS",
    exp: "08 / 2022",
    payment_method: "Visa",
    card_no: "1234 **** **** ****",
  },
];
export default PaymentMethods;
