import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";

const Register: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    aadharCard: null,
    drivingLicence: null,
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileDrop = (files: File[], name: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    toast({
      title: "File Uploaded",
      description: `Successfully uploaded ${files[0].name}`,
    });
  };

  const validateStep = () => {
    const newErrors: any = {};
    if (step === 1) {
      // Personal info step validation
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.mobile) newErrors.mobile = "Mobile number is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    } else if (step === 2 && !formData.aadharCard) {
      // Aadhar card step validation
      newErrors.aadharCard = "Aadhar card is required";
    } else if (step === 3 && !formData.drivingLicence) {
      // Driving licence step validation
      newErrors.drivingLicence = "Driving licence is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const { getRootProps: getAadharRootProps, getInputProps: getAadharInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleFileDrop(acceptedFiles, "aadharCard"),
  });

  const { getRootProps: getDrivingLicenceRootProps, getInputProps: getDrivingLicenceInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleFileDrop(acceptedFiles, "drivingLicence"),
  });

  const handleSubmit = () => {
    if (validateStep()) {
      console.log(formData);
      toast({
        title: "Success",
        description: "Form submitted successfully!",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">User Registration</h1>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="mb-2"
          />
          {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}

          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="mb-2"
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}

          <Label htmlFor="mobile">Mobile</Label>
          <Input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="mb-2"
          />
          {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}

          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="mb-2"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="mb-4"
          />
          {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth}</p>}

          <Button onClick={handleNextStep} className="bg-blue-600 mt-4">
            Next: Aadhar Card
          </Button>
        </div>
      )}

      {/* Step 2: Aadhar Card Upload */}
      {step === 2 && (
        <div>
          <Label htmlFor="aadharCard">Upload Aadhar Card</Label>
          <div
            {...getAadharRootProps()}
            className="border-2 border-dashed border-gray-300 p-4 mb-4 text-center"
          >
            <input {...getAadharInputProps()} />
            {formData.aadharCard ? (
              <p>{formData.aadharCard.name}</p>
            ) : (
              <p>Drag 'n' drop your Aadhar Card here, or click to select</p>
            )}
          </div>
          {errors.aadharCard && <p className="text-red-500">{errors.aadharCard}</p>}

          <Button onClick={handlePreviousStep} className="bg-gray-600 mr-2">
            Back
          </Button>
          <Button onClick={handleNextStep} className="bg-blue-600">
            Next: Driving Licence
          </Button>
        </div>
      )}

      {/* Step 3: Driving Licence Upload */}
      {step === 3 && (
        <div>
          <Label htmlFor="drivingLicence">Upload Driving Licence</Label>
          <div
            {...getDrivingLicenceRootProps()}
            className="border-2 border-dashed border-gray-300 p-4 mb-4 text-center"
          >
            <input {...getDrivingLicenceInputProps()} />
            {formData.drivingLicence ? (
              <p>{formData.drivingLicence.name}</p>
            ) : (
              <p>Drag 'n' drop your Driving Licence here, or click to select</p>
            )}
          </div>
          {errors.drivingLicence && <p className="text-red-500">{errors.drivingLicence}</p>}

          <Button onClick={handlePreviousStep} className="bg-gray-600 mr-2">
            Back
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600">
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default Register;
