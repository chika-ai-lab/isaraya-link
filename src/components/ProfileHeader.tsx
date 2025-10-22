import { motion } from "framer-motion";
import logo from "@/assets/isaraya-logo.png";

const ProfileHeader = () => {
  return (
    <motion.header 
      className="text-center py-12 px-4"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-card/30 backdrop-blur-sm p-4 border-2 border-primary/20"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img 
          src={logo} 
          alt="Isaraya Logo" 
          className="w-full h-full object-contain"
        />
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Isaraya
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-foreground/80 font-medium italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Vivez la modernité, shoppez chez I-Saraya
      </motion.p>
      
      <motion.div 
        className="mt-6 h-1 w-24 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: 96 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      />
    </motion.header>
  );
};

export default ProfileHeader;