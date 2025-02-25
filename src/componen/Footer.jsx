import React from "react";
import "./Footer.css";
import { 
 Typography,  Box
} from "@mui/material";
function Footer() {
  return (
    <footer className="App-footer">
      <img 
        src="/images/logo-sumbawa-barat.png" 
        alt="Logo Sumbawa Barat" 
        className="footer-logo" 
      />
      © {new Date().getFullYear()} Dinas Perumahan dan Permukiman Kabupaten Sumbawa Barat.
    </footer>
    // <Box component="footer" sx={{ py: 3, bgcolor: '#e0f0ff', textAlign: 'center' }}>
    //     <Typography variant="body2" color="text.secondary">
    //       © {new Date().getFullYear()} Dinas Perumahan dan Permukiman Kabupaten Sumbawa Barat.
    //     </Typography>
    //   </Box>
  );
}

export default Footer;
