const Joi = require('joi');
// const validator = require('express-joi-validation').createValidator({});

const questionsObjectSchema = Joi.object({
    k_id: Joi.any().optional().allow(''),
    ques: Joi.string().optional().allow(''),
    question_type: Joi.string().required(),
    ques_order: Joi.any().optional(),
    options: Joi.array().items(Joi.object({
        is_correct: Joi.boolean().required(),
        option_key: Joi.number().required(),
        option_title: Joi.string().required(),
        option_value: Joi.number().required(),
    }))
})

const stepsObjectSchema = Joi.object({
    step_title: Joi.string().allow(''),
    step_type: Joi.string().required(),
    error: Joi.object({}).optional(),
    step_id: Joi.any().optional(),
    step_link: Joi.string().uri().optional().allow(''),
    step_iframeurl: Joi.string().uri().optional().allow('').allow(null),
    step_quiz: Joi.object({
        welcome_text: Joi.string().optional().allow('').allow(null),
        questions: Joi.array().items(questionsObjectSchema)
    })
}).required();

const customCourseBodySchema = Joi.object({
    c_description: Joi.string().required(),
    c_title: Joi.string().required(),
    c_state: Joi.string().required(),
    c_tag: Joi.string().required(),
    c_type: Joi.string().required(),
    c_duration: Joi.number().required(),
    c_id: Joi.any().optional().allow(''),
    c_isManagerSign: Joi.boolean().optional(),
    c_isStepInOrder: Joi.boolean().optional(),
    c_is_steps_ordered: Joi.boolean().optional(),
    c_image: Joi.string().optional().allow(''),
    steps: Joi.array().items(stepsObjectSchema).required(),
    user_role: Joi.number().required()
});

module.exports = customCourseBodySchema;