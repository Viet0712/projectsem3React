import { Route, Routes } from "react-router-dom";
import "./styles/Main.scss";

import { LayoutProvider } from "./Hooks/Layout/LayoutContext";
import LayoutSwitch from "./Hooks/Layout/LayoutSwitch";

import Home from "./view/Page/Home";
import About from "./view/Page/About";
// import AddProduct from "./view/Page/AddProduct";
import ListStore from "./view/Page/Store/ListStore";
import AddStore from "./view/Page/Store/AddStore";
import UpdateStore from "./view/Page/Store/UpdateStore";
import ListAdmin from "./view/Page/Admin/ListAdmin";
import AddAdmin from "./view/Page/Admin/AddAdmin";
import UpdateAdmin from "./view/Page/Admin/UpdateAdmin";
import AddBrand from "./view/Page/Brand/AddBrand";
import ListBrand from "./view/Page/Brand/ListBrand";
import UpdateBrand from "./view/Page/Brand/UpdateBrand";
import AddCategory from "./view/Page/Category/AddCategory";
import ListCategory from "./view/Page/Category/ListCategory";
import Updatecategory from "./view/Page/Category/UpdateCategory";
import ListSubcategory from "./view/Page/Subcategory/ListSubcategory";
import AddSubcategory from "./view/Page/Subcategory/AddSubcategoy";
import UpdateSubcategory from "./view/Page/Subcategory/UpdateSubcategory";
import ListSegment from "./view/Page/Segment/ListSegment";
import AddSegment from "./view/Page/Segment/AddSegment";
import UpdateSegment from "./view/Page/Segment/UpdateSegment";
import ListFlashSale from "./view/Page/Flash_Sale/ListFlashSale";
import AddFlashSale from "./view/Page/Flash_Sale/AddFlashSale";
import UpdateFlashSale from "./view/Page/Flash_Sale/UpdateFlashSale";
import ListDiscount from "./view/Page/Discount/ListDiscount";
import AddDiscount from "./view/Page/Discount/AddDiscount";
import UpdateDiscount from "./view/Page/Discount/UpdateDisCount";
import ListVoucher from "./view/Page/Voucher/ListVoucher";
import AddVoucher from "./view/Page/Voucher/AddVoucher";
import UpdateVoucher from "./view/Page/Voucher/UpdateVoucher";
import AddProduct from "./view/Page/Product/AddProduct";
import AddProperties from "./view/Page/Product/AddProperties";
import ListGoods from "./view/Page/Product/ListGoods";
import ListProduct from "./view/Page/Product/ListProduct";
import UpdateProduct from "./view/Page/Product/UpdateProduct";
import UpdateProperties from "./view/Page/Product/UpdateProperties";
import AddGoods from "./view/Page/Product/AddGoods";
import UpdatePropertiesSadmin from "./view/Page/Product/UpdatePropertiesHightlevel";
import ListProperties from "./view/Page/Product/ListProperties";
import UpdateProductSadmin from "./view/Page/Product/UpdateProductHighLevel";
import ListPropertiesSadmin from "./view/Page/Product/ListPropertiesSAdmin";
import UpdateProfileAdmin from "./view/Page/Admin/UpdateProfileAdmin";
import AddPropertiesSAdmin from "./view/Page/Product/AddPropertiesSAdmin";
import SetEventDiscount from "./view/Page/Event/SetEventDiscount";
import SetEventFlashSale from "./view/Page/Event/SetEventFlashSale";
import ListReview from "./view/Page/Rate/ListReview";

import FeedbackReview from "./view/Page/Rate/FormFeedBack";
import UpdateFeedBack from "./view/Page/Rate/UpdateFeedBack";
import UpdateProfileSAdmin from "./view/Page/Admin/UpdateProFileSAdmin";

import ListQuestion from "./view/Page/Question/ListQuestion";
import FeedBackQuestion from "./view/Page/Question/FormFeedBack";
import UpdateFeedBackQuestion from "./view/Page/Question/UpdateFeedBack";
import ChartAdmin from "./view/Page/Chart/Chart";
import FaceLogin from "./view/Page/Login/FaceLogin";
import ImportProduct from "./view/Page/Import/ImportProduct";
import ChartSAdmin from "./view/Page/Chart/ChartSAdmin";
import ListOrder from "./view/Page/Order/ListOrder";
import OrderDetail from "./view/Page/Order/OrderDetail";
import DailyReport from "./view/Page/Report/Daily";
import MonthlyReport from "./view/Page/Report/Monthly";
import ErrorPage from "./view/Page/Error";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
function App() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const myCookieTokenValue = cookies.token;
  const myRoleSession = sessionStorage.getItem("role");

  // useEffect(() => {
  //   if (myCookieTokenValue === undefined) {
  //     sessionStorage.clear();
  //     navigate("/");
  //   }
  // }, [myCookieTokenValue]);

  useEffect(() => {
    if (myRoleSession === null) {
      navigate("/");
    }
  }, []);
  // const checkCookieExpiration = useMemo(() => {
  //   if (myCookieTokenValue === undefined) {
  //     sessionStorage.clear();
  //     navigate("/");
  //   }
  // }, [myCookieTokenValue, navigate]);

  return (
    <LayoutProvider>
      {myCookieTokenValue === true && sessionStorage.getItem("role") && (
        <Routes>
          <Route
            path="/about"
            element={
              <LayoutSwitch>
                <About />
              </LayoutSwitch>
            }
          ></Route>
          {/* <Route
            path="/addproduct"
            element={
              <LayoutSwitch>
                <AddProduct />
              </LayoutSwitch>
            }
          ></Route> */}

          <Route
            path="/listpropertiesSadmin"
            element={
              <LayoutSwitch>
                <ListPropertiesSadmin />
              </LayoutSwitch>
            }
          ></Route>
        </Routes>
      )}

      {myCookieTokenValue === true &&
        sessionStorage.getItem("role") === "SAdmin" && (
          <Routes>
            <Route
              path="/addproduct"
              element={
                <LayoutSwitch>
                  <AddProduct />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/report_daily"
              element={
                <LayoutSwitch>
                  <DailyReport />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/report_monthly"
              element={
                <LayoutSwitch>
                  <MonthlyReport />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/importproduct"
              element={
                <LayoutSwitch>
                  <ImportProduct />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/chart_sadmin"
              element={
                <LayoutSwitch>
                  <ChartSAdmin />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updateQuestionRep"
              element={
                <LayoutSwitch>
                  <UpdateFeedBackQuestion />
                </LayoutSwitch>
              }
            ></Route>

            <Route
              path="/feedbackQuestion"
              element={
                <LayoutSwitch>
                  <FeedBackQuestion />
                </LayoutSwitch>
              }
            ></Route>

            <Route
              path="/listquestion"
              element={
                <LayoutSwitch>
                  <ListQuestion />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addpropertiessadmin"
              element={
                <LayoutSwitch>
                  <AddPropertiesSAdmin />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addbrand"
              element={
                <LayoutSwitch>
                  <AddBrand />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listbrand"
              element={
                <LayoutSwitch>
                  <ListBrand />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updatebrand"
              element={
                <LayoutSwitch>
                  <UpdateBrand />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addcategory"
              element={
                <LayoutSwitch>
                  <AddCategory />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listcategory"
              element={
                <LayoutSwitch>
                  <ListCategory />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updatecategory"
              element={
                <LayoutSwitch>
                  <Updatecategory />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listsubcategory"
              element={
                <LayoutSwitch>
                  <ListSubcategory />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addsubcategory"
              element={
                <LayoutSwitch>
                  <AddSubcategory />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updatesubcategory"
              element={
                <LayoutSwitch>
                  <UpdateSubcategory />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listsegment"
              element={
                <LayoutSwitch>
                  <ListSegment />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addsegment"
              element={
                <LayoutSwitch>
                  <AddSegment />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updatesegment"
              element={
                <LayoutSwitch>
                  <UpdateSegment />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addflashsale"
              element={
                <LayoutSwitch>
                  <AddFlashSale />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updateflashsale"
              element={
                <LayoutSwitch>
                  <UpdateFlashSale />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listflashsale"
              element={
                <LayoutSwitch>
                  <ListFlashSale />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listdiscount"
              element={
                <LayoutSwitch>
                  <ListDiscount />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/adddiscount"
              element={
                <LayoutSwitch>
                  <AddDiscount />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updatediscount"
              element={
                <LayoutSwitch>
                  <UpdateDiscount />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listvoucher"
              element={
                <LayoutSwitch>
                  <ListVoucher />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addvoucher"
              element={
                <LayoutSwitch>
                  <AddVoucher />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updatevoucher"
              element={
                <LayoutSwitch>
                  <UpdateVoucher />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listproduct"
              element={
                <LayoutSwitch>
                  <ListProduct />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updateproduct"
              element={
                <LayoutSwitch>
                  <UpdateProduct />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/liststore"
              element={
                <LayoutSwitch>
                  <ListStore />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updatepropertiessadmin"
              element={
                <LayoutSwitch>
                  <UpdatePropertiesSadmin />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updateproductsadmin"
              element={
                <LayoutSwitch>
                  <UpdateProductSadmin />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addStore"
              element={
                <LayoutSwitch>
                  <AddStore />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updateStore"
              element={
                <LayoutSwitch>
                  <UpdateStore />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listadmin"
              element={
                <LayoutSwitch>
                  <ListAdmin />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addadmin"
              element={
                <LayoutSwitch>
                  <AddAdmin />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updateadmin"
              element={
                <LayoutSwitch>
                  <UpdateAdmin />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updateprofilesadmin"
              element={
                <LayoutSwitch>
                  <UpdateProfileSAdmin />
                </LayoutSwitch>
              }
            ></Route>
          </Routes>
        )}

      {myCookieTokenValue === true &&
        sessionStorage.getItem("role") === "Admin" && (
          <Routes>
            <Route
              path="/seteventdiscount"
              element={
                <LayoutSwitch>
                  <SetEventDiscount />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/orderDetail"
              element={
                <LayoutSwitch>
                  <OrderDetail />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/chart_admin"
              element={
                <LayoutSwitch>
                  <ChartAdmin />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listorder"
              element={
                <LayoutSwitch>
                  <ListOrder />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updateRateReply"
              element={
                <LayoutSwitch>
                  <UpdateFeedBack />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/feedbackReview"
              element={
                <LayoutSwitch>
                  <FeedbackReview />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listreview"
              element={
                <LayoutSwitch>
                  <ListReview />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/seteventflashsale"
              element={
                <LayoutSwitch>
                  <SetEventFlashSale />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addproperties"
              element={
                <LayoutSwitch>
                  <AddProperties />
                </LayoutSwitch>
              }
            ></Route>

            <Route
              path="/updateproperties"
              element={
                <LayoutSwitch>
                  <UpdateProperties />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listproperties"
              element={
                <LayoutSwitch>
                  <ListProperties />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/listgoods"
              element={
                <LayoutSwitch>
                  <ListGoods />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/addgoods"
              element={
                <LayoutSwitch>
                  <AddGoods />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/updateprofileadmin"
              element={
                <LayoutSwitch>
                  <UpdateProfileAdmin />
                </LayoutSwitch>
              }
            ></Route>
            <Route
              path="/error"
              element={
                <LayoutSwitch>
                  <ErrorPage />
                </LayoutSwitch>
              }
            ></Route>
          </Routes>
        )}

      <Routes>
        <Route
          path="/"
          element={
            <LayoutSwitch>
              {sessionStorage.getItem("role") === "SAdmin" ? (
                <ListProduct />
              ) : sessionStorage.getItem("role") === "Admin" ? (
                <ListProperties />
              ) : (
                <Home />
              )}
            </LayoutSwitch>
          }
        ></Route>

        <Route
          path="/facelogin"
          element={
            <LayoutSwitch>
              <FaceLogin />
            </LayoutSwitch>
          }
        ></Route>
      </Routes>
      {/* {checkCookieExpiration} */}
    </LayoutProvider>
  );
}

export default App;
