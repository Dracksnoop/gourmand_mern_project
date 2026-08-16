import { Loader2, LocateIcon, Mail, MapPin, MapPinnedIcon, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";

// "Krishna Gurjar" -> "KG". Used when the account has no picture yet.
const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

const Profile = () => {
  const { user, updateProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    profilePicture: user?.profilePicture || "",
  });
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(
    profileData.profilePicture || ""
  );

  // The store rehydrates from localStorage after the first render, so the initial
  // state above can be built from an empty user and leave every field blank.
  useEffect(() => {
    if (!user) return;
    setProfileData({
      fullname: user.fullname || "",
      email: user.email || "",
      address: user.address || "",
      city: user.city || "",
      country: user.country || "",
      profilePicture: user.profilePicture || "",
    });
    setSelectedProfilePicture(user.profilePicture || "");
  }, [user]);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedProfilePicture(result);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateProfile(profileData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: "email", label: "Email", icon: Mail, disabled: true },
    { name: "address", label: "Address", icon: LocateIcon, disabled: false },
    { name: "city", label: "City", icon: MapPin, disabled: false },
    { name: "country", label: "Country", icon: MapPinnedIcon, disabled: false },
  ];

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">Your profile</h1>

      <form
        onSubmit={updateProfileHandler}
        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-center gap-5 p-6 border-b border-gray-100 dark:border-gray-700">
          <Avatar className="relative w-24 h-24 shrink-0">
            <AvatarImage src={selectedProfilePicture} />
            <AvatarFallback className="text-xl font-semibold">
              {getInitials(profileData.fullname)}
            </AvatarFallback>
            <input
              ref={imageRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
            />
            <div
              onClick={() => imageRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
            >
              <Plus className="text-white w-7 h-7" />
            </div>
          </Avatar>

          <div className="w-full text-center sm:text-left">
            <Label htmlFor="fullname" className="text-xs text-gray-500">
              Display name
            </Label>
            <Input
              id="fullname"
              type="text"
              name="fullname"
              value={profileData.fullname}
              onChange={changeHandler}
              placeholder="Your name"
              className="font-bold text-xl mt-1"
            />
            <p className="text-xs text-gray-500 mt-2">
              Click the picture to upload a new one.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 p-6">
          {fields.map(({ name, label, icon: Icon, disabled }) => (
            <div key={name}>
              <Label htmlFor={name} className="text-xs text-gray-500">
                {label}
              </Label>
              <div className="relative mt-1">
                <Icon
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <Input
                  id={name}
                  name={name}
                  disabled={disabled}
                  value={profileData[name as keyof typeof profileData]}
                  onChange={changeHandler}
                  placeholder={`Add your ${label.toLowerCase()}`}
                  className="pl-9"
                />
              </div>
              {disabled && (
                <p className="text-[11px] text-gray-400 mt-1">
                  Your email is used to sign in and cannot be changed here.
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end px-6 pb-6">
          {isLoading ? (
            <Button disabled className="bg-orange hover:bg-hoverOrange">
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="bg-orange hover:bg-hoverOrange px-8">
              Save changes
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
