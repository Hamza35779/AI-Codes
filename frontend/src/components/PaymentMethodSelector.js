import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box, Typography } from '@mui/material';
import { paymentMethods } from '../utils/pakistan';

const PaymentMethodSelector = ({ value, onChange, amount = 0 }) => {
  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">Select Payment Method</FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {paymentMethods.map((method) => (
          <FormControlLabel
            key={method.id}
            value={method.id}
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <span>{method.icon}</span>
                <Box>
                  <Typography variant="body1">{method.name}</Typography>
                  {method.id === 'cod' && amount > 500000 && (
                    <Typography variant="caption" color="error">
                      Amount exceeds COD limit (₨500,000)
                    </Typography>
                  )}
                </Box>
              </Box>
            }
            disabled={method.id === 'cod' && amount > 500000}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default PaymentMethodSelector;
