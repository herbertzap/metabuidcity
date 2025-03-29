import React from "react";
import "./BusinessModel.scss"; // Archivo de estilos

const BusinessModel = () => {
  return (
    <section className="bg-dark text-white py-5 Business-container">
      <div className="container text-center">
        <h2 className="mb-5 display-5 fw-medium">Business Model</h2>

        <div className="row g-4">
          {/* One-Time Payment */}
          <div className="col-md-6">
            <div className="h-100 border-0 fw-medium">
                <h3>FULL EXHIBITION</h3>
                <p>One-Time Payment</p>
              <img
                src="assets/images/business-model-2.png"
                alt="One-Time Payment"
                className="card-img-top  border-image border-30"
              />
              <div className="conte-h5 mt-3 mb-3">
              <h5 className="p-2 px-5 border-30 text-center bg-primary valor ">
                  USD 9.952 + USD 48 PER MONTH
                </h5>
              </div>
                <p className="card-text">
                  Full implementation with <strong>100% revenue ownership.</strong><br />
                  <span className="text-info fw-bold">USD 48/month</span> for maintenance.<br />
                  Optional content updates at a fixed hourly rate.
                </p>

            </div>
          </div>

            {/* Revenue Sharing */}
          <div className="col-md-6">
            <div className="h-100 border-0 fw-medium">
                <h3>FROM SCRATCH</h3>
                <p>Revenue Sharing</p>
              <img
                src="assets/images/business-model-1.png"
                alt="Revenue Sharing"
                className="card-img-top  border-image border-30"
              />
              <div className="conte-h5 mt-3 mb-3">
              <h5 className="p-2 px-5 border-30 text-center bg-primary valor ">
                    USD 0 + USD 0 PER MONTH
                </h5>
              </div>
                <p className="card-text">
                No initial cost, no maintenance fees.<br />
                  <span className="text-info fw-bold">Revenue is shared 50/50</span> from stand, ad, and ticket sales.<br />
                  Full platform management by MetaBuild HUB.
                </p>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModel;
