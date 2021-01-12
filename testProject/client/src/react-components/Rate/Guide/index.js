import React, { useState } from "react";

import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import ExpandMoreIcron from '@material-ui/icons/ExpandMore';
// import Button from "@material-ui/core/Button";
import "./styles.css";

const Guide = props => {
  return (
    <div className="Guide">
      <Card variant="outlined">
        <CardHeader
          className="card__title"
          title="How To Rate?" 
        />
        <CardContent>
          <Typography
            className="description"
            variant="body2"
          >
            Rate the university in the <strong>six</strong> different categories 
            and leave a comment to more specifically discuss your 
            thoughts on the school. 
          </Typography>

          <Typography
            className="description"
            variant="body2"
          >
            For each category, <strong>five stars</strong> means you strongly agree 
            that the school has the trait on the right side, and 
            vice versa.
          </Typography>
        </CardContent>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcron/>}
            >
              <Typography className="">
                Example
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography
                className="description"
                variant="body2"
              >
                If you gave <strong>Safety</strong> a five-star, that would mean that 
                you think the school is very <strong>secure</strong>. If you gave it 
                a one-star, that would mean that you think the school 
                is very <strong>unsafe</strong>.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Card>
    </div>
  );
}

export default Guide;