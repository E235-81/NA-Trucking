import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar, CalendarIcon, Clock, MapPin, Package, Phone, Mail, User, Truck, Weight, Ruler } from 'lucide-react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Anti-troll validation utilities
const profanityList = [
  'fuck', 'shit', 'bitch', 'pussy', 'ass', 'damn', 'hell', 'crap', 'piss', 'cock', 'dick', 'penis', 'vagina',
  'slut', 'whore', 'bastard', 'retard', 'gay', 'fag', 'nigger', 'nigga', 'chink', 'spic', 'kike', 'wetback',
  'your gay', 'youre gay', 'ur gay', 'stupid', 'idiot', 'moron', 'dumb', 'loser', 'suck', 'sucks'
];

const gibberishPatterns = [
  /^(test|testing|asdf|qwerty|admin|user|name|john|jane|sample|example|demo|placeholder|temp|temporary)$/i,
  /^[a-z]{1,2}$/i, // Single or double letters
  /^(.)\1{2,}$/i, // Repeated characters (aaa, bbb, etc.)
  /^(lol|haha|lmao|rofl|wtf|omg|brb|ttyl|idk|tbh|smh|fml|yolo|swag){2,}$/i, // Repeated internet slang
  /^[0-9]+$/, // Only numbers
  /^[^a-zA-Z\s]+$/, // No letters at all
  /^(abc|xyz|123|456|789|000|111|222|333|444|555|666|777|888|999)+$/i
];

const validateFullName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "Name is required";
  }

  const trimmedName = name.trim();
  
  // Check for numbers or symbols (only letters and spaces allowed)
  if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
    return "Enter a valid full name.";
  }

  // Split into words and validate structure
  const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
  
  // Must have 1-3 words
  if (words.length === 0 || words.length > 3) {
    return "Enter a valid full name.";
  }

  // Each word must be at least 2 characters
  if (words.some(word => word.length < 2)) {
    return "Enter a valid full name.";
  }

  // Check for profanity
  const lowerName = trimmedName.toLowerCase();
  if (profanityList.some(word => lowerName.includes(word))) {
    return "Enter a valid full name.";
  }

  // Check for gibberish patterns
  if (gibberishPatterns.some(pattern => pattern.test(trimmedName))) {
    return "Enter a valid full name.";
  }

  // Check for repetitive patterns across the whole name
  if (isRepeatedCharacters(trimmedName.replace(/\s/g, ''))) {
    return "Enter a valid full name.";
  }

  return null;
};

const isRepeatedCharacters = (value: string): boolean => {
  if (value.length < 3) return false;
  const uniqueChars = new Set(value.replace('.', ''));
  return uniqueChars.size <= 2; // Allow up to 2 unique characters (e.g., "10" is valid, "111" is not)
};

const isTestPattern = (value: string): boolean => {
  const testPatterns = [
    /^123+$/,     // 123, 1234, 12345, etc.
    /^987+$/,     // 987, 9876, 98765, etc.
    /^111+$/,     // 111, 1111, 11111, etc.
    /^999+$/,     // 999, 9999, 99999, etc.
    /^000+$/,     // 000, 0000, 00000, etc.
    /^(12)+$/,    // 121212, etc.
    /^(69)+$/,    // 696969, etc.
    /^(42)+$/,    // 424242, etc.
  ];
  return testPatterns.some(pattern => pattern.test(value));
};

const validateNumericInput = (value: number, fieldName: string): string | null => {
  const valueStr = value.toString();
  
  if (isRepeatedCharacters(valueStr)) {
    return "Please enter realistic freight values.";
  }
  
  if (isTestPattern(valueStr)) {
    return "Please enter realistic freight values.";
  }
  
  return null;
};

const formSchema = z.object({
  clientName: z.string()
    .min(1, 'Name is required')
    .refine((name) => {
      const error = validateFullName(name);
      return error === null;
    }, {
      message: 'Enter a valid full name.'
    }),
  clientPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  clientEmail: z.string().email('Please enter a valid email address'),
  fromCity: z.string().min(2, 'Origin city is required'),
  toCity: z.string().min(2, 'Destination city is required'),
  cargoSpecialization: z.string().min(1, 'Please select cargo type'),
  otherCargoDescription: z.string().optional(),
  truckQty: z.number().min(1, 'At least 1 truck is required').max(3, 'Maximum 3 trucks allowed'),
  grossWeight: z.number().min(100, 'Minimum weight is 100 lbs'),
  loadingDate: z.date({
    required_error: 'Loading date is required',
  }),
  loadingHour: z.number().min(0).max(23),
  loadingMinute: z.number().min(0).max(59),
  cargoLength: z.number().min(4, 'Dimensions must fit inside a standard 53\' trailer').max(53, 'Dimensions must fit inside a standard 53\' trailer'),
  cargoWidth: z.number().min(3, 'Dimensions must fit inside a standard 53\' trailer').max(8.5, 'Dimensions must fit inside a standard 53\' trailer'),
  cargoHeight: z.number().min(3, 'Dimensions must fit inside a standard 53\' trailer').max(9, 'Dimensions must fit inside a standard 53\' trailer'),
  dimensionUnit: z.enum(['feet', 'inches']),
}).superRefine((data, ctx) => {
  // Cross-field validation for weight vs truck capacity
  if (data.grossWeight > data.truckQty * 45000) {
    ctx.addIssue({
      path: ['grossWeight'],
      code: z.ZodIssueCode.custom,
      message: 'This exceeds truck capacity. Maximum weight is 45,000 lbs per truck.',
    });
  }
  
  // Anti-troll validation (only on submit)
  if (validateNumericInput(data.truckQty, 'truck quantity')) {
    ctx.addIssue({
      path: ['truckQty'],
      code: z.ZodIssueCode.custom,
      message: 'Please enter realistic freight values.',
    });
  }
  
  if (validateNumericInput(data.grossWeight, 'weight')) {
    ctx.addIssue({
      path: ['grossWeight'],
      code: z.ZodIssueCode.custom,
      message: 'Please enter realistic freight values.',
    });
  }
  
  ['cargoLength', 'cargoWidth', 'cargoHeight'].forEach((field) => {
    if (validateNumericInput(data[field as keyof typeof data] as number, field)) {
      ctx.addIssue({
        path: [field],
        code: z.ZodIssueCode.custom,
        message: 'Please enter realistic freight values.',
      });
    }
  });
});

type FormData = z.infer<typeof formSchema>;

const cargoTypes = [
  'General Freight',
  'Refrigerated',
  'Hazardous Materials',
  'Oversized/Heavy Haul',
  'Automotive',
  'Construction Materials',
  'Electronics',
  'Food & Beverage',
  'Machinery',
  'Textiles',
  'Other'
];

export default function FreightQuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [nameValidationError, setNameValidationError] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      fromCity: '',
      toCity: '',
      cargoSpecialization: '',
      otherCargoDescription: '',
      truckQty: 1,
      grossWeight: 100,
      loadingHour: 9,
      loadingMinute: 0,
      cargoLength: 4,
      cargoWidth: 3,
      cargoHeight: 3,
      dimensionUnit: 'feet',
    },
    mode: 'onSubmit', // Only validate on submit, not while typing
  });

  const calculateVolume = (length: number, width: number, height: number) => {
    return length * width * height;
  };

  // Watch for changes in truck quantity and weight to validate dynamically
  const watchedTruckQty = form.watch('truckQty');
  const watchedWeight = form.watch('grossWeight');
  const watchedLength = form.watch('cargoLength');
  const watchedWidth = form.watch('cargoWidth');
  const watchedHeight = form.watch('cargoHeight');
  
  // Helper function to validate field on blur
  const validateFieldOnBlur = (fieldName: string, value: number) => {
    const trollError = validateNumericInput(value, fieldName);
    if (trollError) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: trollError }));
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Helper function to validate name on blur
  const validateNameOnBlur = (name: string) => {
    const error = validateFullName(name);
    setNameValidationError(error || '');
  };
  
  // Calculate volume and total load space
  const cargoVolume = calculateVolume(watchedLength || 4, watchedWidth || 3, watchedHeight || 3);
  const totalLoadSpace = cargoVolume * (watchedTruckQty || 1);
  const maxVolumeCapacity = 3000; // 3 trucks × ~1,000 ft³ per truck
  const isOversized = totalLoadSpace > maxVolumeCapacity;
  
  // Calculate max allowed weight based on truck quantity
  const maxAllowedWeight = watchedTruckQty * 45000;
  const isWeightExceeded = watchedWeight > maxAllowedWeight;
  
  // Check if dimensions are within trailer limits
const areDimensionsValid =
  watchedLength >= 4 && watchedLength <= 53 &&
  watchedWidth >= 3 && watchedWidth <= 8.5 &&
  watchedHeight >= 3 && watchedHeight <= 9;
  const onSubmit = async (data: FormData) => {
    // Additional validation before submission
    if (data.grossWeight > data.truckQty * 45000) {
      toast({
        title: "Weight Limit Exceeded",
        description: "This exceeds truck capacity. Maximum weight is 45,000 lbs per truck.",
        variant: "destructive",
      });
      return;
    }

    // Additional dimension validation before submission
    if (data.cargoLength < 4 || data.cargoLength > 53 ||
        data.cargoWidth < 3 || data.cargoWidth > 8.5 ||
        data.cargoHeight < 3 || data.cargoHeight > 9) {
      toast({
        title: "Invalid Dimensions",
        description: "Dimensions must fit inside a standard 53' trailer.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const cargoVolume = calculateVolume(data.cargoLength, data.cargoWidth, data.cargoHeight);
      
      const { error } = await supabase
        .from('freight_quotes')
        .insert({
          client_name: data.clientName,
          client_phone: data.clientPhone,
          client_email: data.clientEmail,
          from_city: data.fromCity,
          to_city: data.toCity,
          cargo_specialization: data.cargoSpecialization,
          other_cargo_description: data.otherCargoDescription || '',
          truck_qty: data.truckQty,
          gross_weight: data.grossWeight,
          loading_date: data.loadingDate.toISOString().split('T')[0],
          loading_hour: data.loadingHour,
          loading_minute: data.loadingMinute,
          cargo_length: data.cargoLength,
          cargo_width: data.cargoWidth,
          cargo_height: data.cargoHeight,
          dimension_unit: data.dimensionUnit,
          cargo_volume: cargoVolume,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Quote Request Submitted!",
        description: "We'll get back to you with a competitive quote within 24 hours.",
      });

      setValidationErrors({});
      form.reset();
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Get Your Freight Quote
          </CardTitle>
          <CardDescription className="text-lg text-gray-300">
            Fill out the details below and we'll provide you with a competitive shipping quote
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-white">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field}
                            onBlur={(e) => {
                              field.onBlur();
                              validateNameOnBlur(e.target.value);
                            }}
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                        {nameValidationError && (
                          <div className="text-red-400 text-sm font-medium">
                            {nameValidationError}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(555) 123-4567" 
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="john@example.com" 
                            type="email"
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Shipping Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-white">Shipping Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fromCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">Origin Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1234 Logistics Ave, Chicago, IL or Toronto, ON" 
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">Destination Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="567 Industrial Blvd, Miami, FL or Calgary, AB" 
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Cargo Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-white">Cargo Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cargoSpecialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">Cargo Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                              <SelectValue placeholder="Select cargo type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {cargoTypes.map((type) => (
                              <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="truckQty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">
                          Number of Trucks <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                            type="number" 
                            min="1"
                            max="3"
                            step="1"
                            readOnly
                            {...field}
                            value={field.value}
                            className="bg-gray-800 border-gray-700 text-white text-center focus:border-blue-500 focus:ring-blue-500 rounded-lg cursor-default [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            style={{
                              MozAppearance: 'textfield',
                              WebkitAppearance: 'none'
                            }}
                            />
                            {/* Custom stepper buttons */}
                            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col">
                              <button
                                type="button"
                                onClick={() => {
                                  const newValue = Math.min(field.value + 1, 3);
                                  field.onChange(newValue);
                                }}
                                disabled={field.value >= 3}
                                className="w-8 h-6 flex items-center justify-center bg-gray-700 border border-white/20 rounded-t-md text-white hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-700 disabled:hover:text-white transition-all duration-200 shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] disabled:shadow-none"
                                aria-label="Increase truck quantity"
                              >
                                <ChevronUp className="w-4 h-4 font-bold stroke-2" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const newValue = Math.max(field.value - 1, 1);
                                  field.onChange(newValue);
                                }}
                                disabled={field.value <= 1}
                                className="w-8 h-6 flex items-center justify-center bg-gray-700 border border-white/20 rounded-b-md text-white hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-700 disabled:hover:text-white transition-all duration-200 shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] disabled:shadow-none"
                                aria-label="Decrease truck quantity"
                              >
                                <ChevronDown className="w-4 h-4 font-bold stroke-2" />
                              </button>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-gray-400 text-sm">
                          Max 3 trucks per shipment. For more, contact dispatch.
                        </FormDescription>
                        {validationErrors.truckQty && (
                          <div className="text-red-400 text-sm font-medium">
                            {validationErrors.truckQty}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Truck Capacity Guidelines */}
                <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-4">
                  <div className="text-amber-300 text-sm">
                    <strong>Truck Capacity Guidelines:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Standard truck: 45,000 lbs maximum weight capacity</li>
                      <li>Standard dimensions: 53' L × 8.5' W × 9' H</li>
                      <li>For oversized/overweight cargo, special permits may be required</li>
                      <li>Multiple trucks available for larger shipments (max 3 per quote)</li>
                    </ul>
                  </div>
                </div>
                {form.watch('cargoSpecialization') === 'Other' && (
                  <FormField
                    control={form.control}
                    name="otherCargoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">Cargo Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your cargo..."
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="grossWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">
                          Gross Weight (lbs) <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="100"
                            placeholder="1000"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow any input while typing
                              if (value === '') {
                                field.onChange('');
                              } else {
                                const numValue = parseFloat(value);
                                if (!isNaN(numValue)) {
                                  field.onChange(numValue);
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseFloat(e.target.value);
                              if (isNaN(value) || value < 100) {
                                field.onChange(100);
                              }
                            }}
                            className={cn(
                              "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg",
                              isWeightExceeded && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400 text-sm">
                          Range: 100 - {maxAllowedWeight.toLocaleString()} lbs ({watchedTruckQty} truck{watchedTruckQty > 1 ? 's' : ''})
                        </FormDescription>
                        {isWeightExceeded && (
                          <div className="text-red-400 text-sm font-medium">
                            This exceeds truck capacity. Maximum weight is 45,000 lbs per truck.
                          </div>
                        )}
                        {validationErrors.grossWeight && (
                          <div className="text-red-400 text-sm font-medium">
                            {validationErrors.grossWeight}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  {/* Weight Calculator Display */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="text-gray-300 font-medium mb-2">Total Capacity Used</div>
                    <div className={cn(
                      "text-2xl font-bold",
                      isWeightExceeded ? "text-red-400" : "text-green-400"
                    )}>
                      {(() => {
                        const weight = watchedWeight || 100;
                        const trucks = watchedTruckQty || 1;
                        const totalCapacity = trucks * 45000;
                        const percentage = totalCapacity > 0 ? ((weight / totalCapacity) * 100).toFixed(1) : '0.0';
                        return `${percentage}%`;
                      })()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {(() => {
                        const weight = watchedWeight || 100;
                        const trucks = watchedTruckQty || 1;
                        const totalCapacity = trucks * 45000;
                        return `${weight.toLocaleString()} / ${totalCapacity.toLocaleString()} lbs`;
                      })()}
                    </div>
                    {isWeightExceeded && (
                      <div className="text-xs text-red-400 mt-2 font-medium">
                        ⚠️ Exceeds capacity
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cargo Dimensions */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Ruler className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-white">Cargo Dimensions</h3>
                </div>
                
                {/* Measurement Unit Selection */}
                <FormField
                  control={form.control}
                  name="dimensionUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-medium">Measurement Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg w-48">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="feet" className="text-white hover:bg-gray-700">Imperial (feet)</SelectItem>
                          <SelectItem value="inches" className="text-white hover:bg-gray-700">Imperial (inches)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="cargoLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">
                          Length <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                            type="number" 
                            min="4"
                            max="53"
                            step="0.001"
                            placeholder="4.0"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow any input while typing
                              if (value === '') {
                                field.onChange('');
                              } else {
                                const numValue = parseFloat(value);
                                if (!isNaN(numValue)) {
                                  field.onChange(numValue);
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseFloat(e.target.value);
                              if (isNaN(value) || value < 4) {
                                field.onChange(4);
                              } else if (value > 53) {
                                field.onChange(53);
                              }
                            }}
                            className={cn(
                              "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg",
                              validationErrors.cargoLength && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                          />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                              {form.watch('dimensionUnit') === 'feet' ? 'ft' : 'in'}
                            </span>
                          </div>
                        </FormControl>
                        <div className="text-xs text-gray-400">
                          Range: 4 - 53 ft
                        </div>
                        {validationErrors.cargoLength && (
                          <div className="text-red-400 text-sm font-medium">
                            {validationErrors.cargoLength}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cargoWidth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">
                          Width <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                            type="number" 
                            min="3"
                            max="8.5"
                            step="0.001"
                            placeholder="3.0"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow any input while typing
                              if (value === '') {
                                field.onChange('');
                              } else {
                                const numValue = parseFloat(value);
                                if (!isNaN(numValue)) {
                                  field.onChange(numValue);
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseFloat(e.target.value);
                              if (isNaN(value) || value < 3) {
                                field.onChange(3);
                              } else if (value > 8.5) {
                                field.onChange(8.5);
                              }
                            }}
                            className={cn(
                              "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg",
                              validationErrors.cargoWidth && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                          />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                              {form.watch('dimensionUnit') === 'feet' ? 'ft' : 'in'}
                            </span>
                          </div>
                        </FormControl>
                        <div className="text-xs text-gray-400">
                          Range: 3 - 8.5 ft
                        </div>
                        {validationErrors.cargoWidth && (
                          <div className="text-red-400 text-sm font-medium">
                            {validationErrors.cargoWidth}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cargoHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">
                          Height <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                            type="number" 
                            min="3"
                            max="9"
                            step="0.001"
                            placeholder="3.0"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow any input while typing
                              if (value === '') {
                                field.onChange('');
                              } else {
                                const numValue = parseFloat(value);
                                if (!isNaN(numValue)) {
                                  field.onChange(numValue);
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseFloat(e.target.value);
                              if (isNaN(value) || value < 3) {
                                field.onChange(3);
                              } else if (value > 9) {
                                field.onChange(9);
                              }
                            }}
                            className={cn(
                              "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg",
                              validationErrors.cargoHeight && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                          />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                              {form.watch('dimensionUnit') === 'feet' ? 'ft' : 'in'}
                            </span>
                          </div>
                        </FormControl>
                        <div className="text-xs text-gray-400">
                          Range: 3 - 9 ft
                        </div>
                        {validationErrors.cargoHeight && (
                          <div className="text-red-400 text-sm font-medium">
                            {validationErrors.cargoHeight}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  {/* Volume Calculator Display */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="text-gray-300 font-medium mb-2">Calculated Volume</div>
                    <div className={cn(
                      "text-2xl font-bold",
                      "text-blue-400"
                    )}>
                      {cargoVolume.toFixed(2)} {form.watch('dimensionUnit') === 'feet' ? 'ft³' : 'in³'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Length × Width × Height
                    </div>
                  </div>
                </div>
                
                {/* Total Load Space Calculator */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-gray-300 font-medium">Total Load Space</div>
                    <div className="text-xs text-gray-400">
                      {watchedTruckQty} truck{watchedTruckQty > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Volume per truck */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Volume per truck:</span>
                      <span className="text-white font-medium">
                        {cargoVolume.toFixed(2)} ft³
                      </span>
                    </div>
                    
                    {/* Total volume */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total volume:</span>
                      <span className={cn(
                        "font-bold text-lg",
                        isOversized ? "text-amber-400" : "text-green-400"
                      )}>
                        {totalLoadSpace.toFixed(2)} ft³
                      </span>
                    </div>
                    
                    {/* Capacity indicator */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          isOversized ? "bg-amber-500" : "bg-green-500"
                        )}
                        style={{ 
                          width: `${Math.min((totalLoadSpace / maxVolumeCapacity) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0 ft³</span>
                      <span>{maxVolumeCapacity.toLocaleString()} ft³ (max)</span>
                    </div>
                    
                    {/* Oversized warning */}
                    {isOversized && (
                      <div className="bg-amber-900/30 border border-amber-600/30 rounded-lg p-3 mt-3">
                        <div className="flex items-start gap-2">
                          <div className="text-amber-400 text-lg">⚠️</div>
                          <div>
                            <div className="text-amber-300 font-medium text-sm">
                              Oversized Cargo Warning
                            </div>
                            <div className="text-amber-200 text-xs mt-1">
                              This cargo may require special routing due to volume.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Dimension Guidelines */}
                <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-4">
                  <div className="text-amber-300 text-sm">
                    <strong>Standard Trailer Limits:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li><strong>Length:</strong> 4 ft minimum, 53 ft maximum</li>
                      <li><strong>Width:</strong> 3 ft minimum, 8.5 ft maximum</li>
                      <li><strong>Height:</strong> 3 ft minimum, 9 ft maximum</li>
                      <li>Dimensions outside these ranges require special permits and equipment</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Loading Schedule */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-white">Loading Schedule</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="loadingDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-gray-300 font-medium">Loading Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-lg",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              className="bg-gray-800 border-gray-700 rounded-lg"
                              classNames={{
                                months: "w-full",
                                table: "w-full border-collapse",
                                head_row: "flex",
                                head_cell: "flex-1 text-center text-gray-400 text-sm font-medium p-2",
                                row: "flex w-full",
                                cell: "flex-1 p-0 relative",
                                day: "!text-white text-2xl font-bold w-full h-14 flex items-center justify-center hover:bg-white/10 transition-all duration-150 shadow-[0_0_6px_#ffffff]",
                                day_selected: "text-white bg-blue-600 font-bold border border-blue-400 shadow-[0_0_10px_#00f] !text-white",
                                day_today: "text-white font-bold border border-white/20 bg-gray-700",
                                day_outside: "text-white/30", // Outside current month? Still white-ish
                                day_disabled: "text-gray-600 cursor-not-allowed opacity-40",
                                caption: "text-white text-lg font-bold pb-4 flex justify-center",
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loadingHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">Hour</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()} className="text-white hover:bg-gray-700">
                                {i.toString().padStart(2, '0')}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loadingMinute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-medium">Minute</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {[0, 15, 30, 45].map((minute) => (
                              <SelectItem key={minute} value={minute.toString()} className="text-white hover:bg-gray-700">
                                :{minute.toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || isWeightExceeded || !areDimensionsValid || Object.keys(validationErrors).length > 0 || nameValidationError !== ''}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Submitting Quote Request...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Get My Quote
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}