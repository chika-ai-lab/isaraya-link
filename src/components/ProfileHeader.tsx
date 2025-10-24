import { motion } from "framer-motion";
import { Profile } from "@/types";

interface ProfileHeaderProps {
  profile: Profile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <motion.header
      className="text-center py-8 sm:py-12 px-4"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {profile.logo_url && (
        <motion.div
          className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden bg-card/30 backdrop-blur-sm p-3 sm:p-4 border-2 border-primary/20"
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={profile.logo_url}
            alt={`${profile.company_name} Logo`}
            className="w-full h-full object-contain"
          />
        </motion.div>
      )}

      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-foreground px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {profile.company_name}
      </motion.h1>

      {profile.slogan && (
        <motion.p
          className="text-base sm:text-lg md:text-xl text-foreground/80 font-medium italic px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {profile.slogan}
        </motion.p>
      )}

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
