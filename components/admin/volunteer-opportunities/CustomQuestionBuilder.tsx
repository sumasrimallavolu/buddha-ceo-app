'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CustomQuestionOption {
  id: string;
  label: string;
}

export interface CustomQuestion {
  id: string;
  title: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox';
  required: boolean;
  options?: CustomQuestionOption[];
}

interface CustomQuestionBuilderProps {
  questions: CustomQuestion[];
  onChange: (questions: CustomQuestion[]) => void;
}

export function CustomQuestionBuilder({
  questions,
  onChange,
}: CustomQuestionBuilderProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<CustomQuestion>>({
    title: '',
    type: 'text',
    required: false,
    options: [],
  });

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Add new question
  const handleAddQuestion = () => {
    if (!newQuestion.title?.trim()) return;

    const question: CustomQuestion = {
      id: generateId(),
      title: newQuestion.title.trim(),
      type: (newQuestion.type as CustomQuestion['type']) || 'text',
      required: newQuestion.required || false,
      options: newQuestion.options || [],
    };

    onChange([...questions, question]);
    setNewQuestion({
      title: '',
      type: 'text',
      required: false,
      options: [],
    });
  };

  // Update existing question
  const handleUpdateQuestion = (id: string, updates: Partial<CustomQuestion>) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    onChange(updatedQuestions);
  };

  // Delete question
  const handleDeleteQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
    if (editingId === id) setEditingId(null);
  };

  // Add option to select/checkbox question
  const handleAddOption = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const newOption: CustomQuestionOption = {
      id: generateId(),
      label: '',
    };

    handleUpdateQuestion(questionId, {
      options: [...(question.options || []), newOption],
    });
  };

  // Update option
  const handleUpdateOption = (
    questionId: string,
    optionId: string,
    label: string
  ) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question?.options) return;

    const updatedOptions = question.options.map((opt) =>
      opt.id === optionId ? { ...opt, label } : opt
    );

    handleUpdateQuestion(questionId, { options: updatedOptions });
  };

  // Remove option
  const handleRemoveOption = (questionId: string, optionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question?.options) return;

    const updatedOptions = question.options.filter((opt) => opt.id !== optionId);
    handleUpdateQuestion(questionId, { options: updatedOptions });
  };

  // Check if question type supports options
  const hasOptions = (type: CustomQuestion['type']) =>
    type === 'select' || type === 'checkbox';

  return (
    <div className="space-y-6">
      {/* Existing Questions List */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-semibold text-white">
            Custom Questions ({questions.length})
          </Label>

          <div className="space-y-3">
            {questions.map((question, index) => {
              const isEditing = editingId === question.id;
              const showOptions = hasOptions(question.type);

              return (
                <div
                  key={question.id}
                  className={cn(
                    'group relative rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20',
                    isEditing && 'border-blue-500/50 bg-blue-500/5'
                  )}
                >
                  {/* Drag Handle */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-5 w-5 text-white/40" />
                  </div>

                  <div className="ml-6 space-y-3">
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-white/60">Q{index + 1}.</span>
                          <span className="text-white font-medium">
                            {question.title}
                          </span>
                          {question.required && (
                            <span className="text-red-400">*</span>
                          )}
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-xs font-medium',
                              'bg-white/10 text-white/80'
                            )}
                          >
                            {question.type}
                          </span>
                        </div>

                        {/* Show options if applicable */}
                        {showOptions && question.options && question.options.length > 0 && (
                          <div className="ml-6 space-y-1">
                            {question.options.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center gap-2 text-sm text-white/70"
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                                <span>{option.label || '(empty option)'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setEditingId(isEditing ? null : question.id)}
                          className="text-white/60 hover:text-white hover:bg-white/10"
                        >
                          {isEditing ? (
                            <span className="text-xs">Done</span>
                          ) : (
                            <span className="text-xs">Edit</span>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Edit Mode */}
                    {isEditing && (
                      <div className="space-y-3 pt-3 border-t border-white/10">
                        {/* Title Input */}
                        <div className="space-y-1.5">
                          <Label htmlFor={`edit-title-${question.id}`} className="text-sm text-white/80">
                            Question Title
                          </Label>
                          <Input
                            id={`edit-title-${question.id}`}
                            value={question.title}
                            onChange={(e) =>
                              handleUpdateQuestion(question.id, { title: e.target.value })
                            }
                            placeholder="Enter question title"
                          />
                        </div>

                        {/* Type Select */}
                        <div className="space-y-1.5">
                          <Label htmlFor={`edit-type-${question.id}`} className="text-sm text-white/80">
                            Question Type
                          </Label>
                          <Select
                            value={question.type}
                            onValueChange={(value: CustomQuestion['type']) =>
                              handleUpdateQuestion(question.id, {
                                type: value,
                                options: hasOptions(value) ? question.options || [] : undefined,
                              })
                            }
                          >
                            <SelectTrigger id={`edit-type-${question.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Select Dropdown</SelectItem>
                              <SelectItem value="checkbox">Checkbox Group</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Required Checkbox */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                          <Checkbox
                            id={`edit-required-${question.id}`}
                            checked={question.required}
                            onCheckedChange={(checked) =>
                              handleUpdateQuestion(question.id, { required: !!checked })
                            }
                          />
                          <Label
                            htmlFor={`edit-required-${question.id}`}
                            className="cursor-pointer text-sm text-white/80"
                          >
                            Required field
                          </Label>
                        </div>

                        {/* Options Management */}
                        {showOptions && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm text-white/80">
                                Options
                              </Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="xs"
                                onClick={() => handleAddOption(question.id)}
                                className="h-7"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Option
                              </Button>
                            </div>

                            <div className="space-y-2">
                              {question.options?.map((option, optIndex) => (
                                <div key={option.id} className="flex gap-2">
                                  <Input
                                    value={option.label}
                                    onChange={(e) =>
                                      handleUpdateOption(question.id, option.id, e.target.value)
                                    }
                                    placeholder={`Option ${optIndex + 1}`}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveOption(question.id, option.id)}
                                    className="h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}

                              {(!question.options || question.options.length === 0) && (
                                <p className="text-sm text-white/40 text-center py-3 rounded-xl bg-white/5">
                                  No options added yet
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Question Form */}
      <div className="space-y-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4">
        <Label className="text-base font-semibold text-white">
          Add New Question
        </Label>

        <div className="space-y-3">
          {/* Title Input */}
          <div className="space-y-1.5">
            <Label htmlFor="new-title" className="text-sm text-white/80">
              Question Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="new-title"
              value={newQuestion.title}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, title: e.target.value })
              }
              placeholder="e.g., Why do you want to volunteer?"
            />
          </div>

          {/* Type Select */}
          <div className="space-y-1.5">
            <Label htmlFor="new-type" className="text-sm text-white/80">
              Question Type
            </Label>
            <Select
              value={newQuestion.type}
              onValueChange={(value: CustomQuestion['type']) =>
                setNewQuestion({
                  ...newQuestion,
                  type: value,
                  options: hasOptions(value) ? [] : undefined,
                })
              }
            >
              <SelectTrigger id="new-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="select">Select Dropdown</SelectItem>
                <SelectItem value="checkbox">Checkbox Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Required Checkbox */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <Checkbox
              id="new-required"
              checked={newQuestion.required}
              onCheckedChange={(checked) =>
                setNewQuestion({ ...newQuestion, required: !!checked })
              }
            />
            <Label
              htmlFor="new-required"
              className="cursor-pointer text-sm text-white/80"
            >
              Required field
            </Label>
          </div>

          {/* Add Button */}
          <Button
            type="button"
            onClick={handleAddQuestion}
            disabled={!newQuestion.title?.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {questions.length === 0 && (
        <div className="text-center py-8 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/60">
            No custom questions yet. Add your first question above.
          </p>
        </div>
      )}
    </div>
  );
}
