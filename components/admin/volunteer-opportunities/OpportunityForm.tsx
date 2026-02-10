'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CustomQuestionBuilder,
  CustomQuestion as BuilderCustomQuestion,
  CustomQuestionOption,
} from './CustomQuestionBuilder';
import { X, Loader2, Save, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VolunteerOpportunity, CustomQuestion } from '@/types/volunteer';

interface OpportunityFormProps {
  initialData?: Partial<VolunteerOpportunity>;
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
};

export function OpportunityForm({
  initialData,
  onSubmit,
  submitLabel = 'Create Opportunity',
}: OpportunityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');

  // Convert CustomQuestion to BuilderCustomQuestion format
  const convertToBuilderFormat = (
    questions: CustomQuestion[]
  ): BuilderCustomQuestion[] => {
    return questions.map((q) => ({
      ...q,
      options: q.options?.map((label, idx) => ({
        id: `opt-${idx}`,
        label,
      })),
    }));
  };

  // Convert BuilderCustomQuestion to CustomQuestion format
  const convertToApiFormat = (
    questions: BuilderCustomQuestion[]
  ): CustomQuestion[] => {
    return questions.map((q) => ({
      ...q,
      options: q.options?.map((opt) => opt.label),
    }));
  };

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    location: string;
    type: 'Remote' | 'On-site' | 'Hybrid';
    timeCommitment: string;
    startDate: string;
    endDate: string;
    maxVolunteers: string;
    status: 'draft' | 'open' | 'closed';
    requiredSkills: string[];
    customQuestions: BuilderCustomQuestion[];
  }>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Remote',
    timeCommitment: initialData?.timeCommitment || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    maxVolunteers: initialData?.maxVolunteers?.toString() || '',
    status: initialData?.status || 'draft',
    requiredSkills: initialData?.requiredSkills || [],
    customQuestions: convertToBuilderFormat(initialData?.customQuestions || []),
  });

  // Handle text input changes
  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  // Add skill to list
  const handleAddSkill = () => {
    const trimmedSkill = currentSkill.trim();
    if (trimmedSkill && !formData.requiredSkills.includes(trimmedSkill)) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, trimmedSkill],
      });
      setCurrentSkill('');
    }
  };

  // Remove skill from list
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  // Handle skill input key press (Enter to add)
  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Handle custom questions change
  const handleQuestionsChange = (questions: BuilderCustomQuestion[]) => {
    setFormData({ ...formData, customQuestions: questions });
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'Title is required';
    }
    if (!formData.description.trim()) {
      return 'Description is required';
    }
    if (!formData.location.trim()) {
      return 'Location is required';
    }
    if (!formData.timeCommitment.trim()) {
      return 'Time commitment is required';
    }
    if (!formData.startDate) {
      return 'Start date is required';
    }
    if (!formData.endDate) {
      return 'End date is required';
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return 'End date must be after start date';
    }
    if (formData.maxVolunteers === '' || parseInt(formData.maxVolunteers) < 0) {
      return 'Max volunteers must be a valid number (0 for unlimited)';
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Prepare data for submission
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        type: formData.type,
        timeCommitment: formData.timeCommitment.trim(),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        maxVolunteers: parseInt(formData.maxVolunteers),
        status: formData.status,
        requiredSkills: formData.requiredSkills,
        customQuestions: convertToApiFormat(formData.customQuestions),
      };

      await onSubmit(submitData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save opportunity'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-slate-400 hover:text-white mb-4 -ml-3"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-white">
          {initialData?._id ? 'Edit Opportunity' : 'Create New Opportunity'}
        </h1>
        <p className="text-slate-400 mt-2">
          {initialData?._id
            ? 'Update volunteer opportunity details'
            : 'Fill in the details to create a new volunteer opportunity'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/50">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Basic Information</h2>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Opportunity Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Meditation Program Coordinator"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the volunteer role, responsibilities, and impact..."
                rows={5}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Opportunity Details</h2>

          <div className="space-y-4">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-red-400">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., New York, NY / Remote"
                disabled={loading}
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">
                Type <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
                disabled={loading}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Commitment */}
            <div className="space-y-2">
              <Label htmlFor="timeCommitment">
                Time Commitment <span className="text-red-400">*</span>
              </Label>
              <Input
                id="timeCommitment"
                value={formData.timeCommitment}
                onChange={(e) =>
                  handleInputChange('timeCommitment', e.target.value)
                }
                placeholder="e.g., 5-10 hours per week"
                disabled={loading}
              />
            </div>

            {/* Start and End Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange('startDate', e.target.value)
                  }
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  min={formData.startDate}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Max Volunteers and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxVolunteers">
                  Max Volunteers <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="maxVolunteers"
                  type="number"
                  min="0"
                  value={formData.maxVolunteers}
                  onChange={(e) =>
                    handleInputChange('maxVolunteers', e.target.value)
                  }
                  placeholder="0 for unlimited"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500">
                  Enter 0 for unlimited volunteers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange('status', value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Required Skills Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Required Skills</h2>

          <div className="space-y-4">
            {/* Skill Input */}
            <div className="flex gap-2">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={handleSkillKeyPress}
                placeholder="Enter a skill and press Enter or click Add"
                disabled={loading}
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                disabled={!currentSkill.trim() || loading}
                variant="outline"
              >
                Add
              </Button>
            </div>

            {/* Skills Tags */}
            {formData.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      disabled={loading}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {formData.requiredSkills.length === 0 && (
              <p className="text-sm text-slate-500">
                No skills added yet. Add skills that volunteers should have.
              </p>
            )}
          </div>
        </div>

        {/* Custom Questions Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">
            Custom Application Questions
          </h2>

          <CustomQuestionBuilder
            questions={formData.customQuestions}
            onChange={handleQuestionsChange}
          />

          <p className="text-sm text-slate-500">
            Add custom questions that volunteers will answer when applying for
            this opportunity.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[160px]">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {submitLabel}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
