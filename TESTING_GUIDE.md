# 🧪 Workflow Testing Guide

This guide will help you test your workflows step by step.

## 📋 Quick Test Workflow

### Test 1: Simple AI Text Generation

**Steps:**
1. **Add Nodes:**
   - Drag **Schedule Trigger** onto canvas
   - Drag **AI Text Generator** onto canvas
   - Connect: Schedule Trigger → AI Text Generator

2. **Configure Nodes:**
   - **Schedule Trigger**: 
     - Interval: `1` minute (for quick testing)
   - **AI Text Generator**:
     - Prompt: `Write a short poem about coding`
     - Temperature: `0.7`
     - Max Tokens: `200`

3. **Execute:**
   - Click **Execute** button in sidebar
   - Watch the nodes execute (they'll show loading animation)
   - Check the output by clicking on the AI Text Generator node

4. **Verify:**
   - ✅ Node should show green checkmark when done
   - ✅ Output should contain generated text
   - ✅ Check browser console for any errors

---

### Test 2: AI Text Generator → Email (Full Workflow)

**Steps:**
1. **Add Nodes:**
   - Drag **Schedule Trigger** onto canvas
   - Drag **AI Text Generator** onto canvas
   - Drag **Send Email** onto canvas
   - Connect: Schedule Trigger → AI Text Generator → Send Email

2. **Configure Nodes:**
   - **Schedule Trigger**: Interval `1` minute
   - **AI Text Generator**:
     - Prompt: `Write a professional email greeting`
     - Temperature: `0.7`
     - Max Tokens: `300`
   - **Send Email**:
     - To: `your-email@example.com` (use your real email)
     - Subject: `AI Generated Content`
     - Body: `{{input.generatedText}}`

3. **Execute:**
   - Click **Execute** button
   - Wait for execution to complete

4. **Verify:**
   - ✅ All nodes show green checkmarks
   - ✅ Check your email inbox
   - ✅ Email should contain the AI-generated text

---

### Test 3: AI Content Analyzer

**Steps:**
1. **Add Nodes:**
   - Schedule Trigger → AI Content Analyzer

2. **Configure:**
   - **AI Content Analyzer**:
     - Text: `I love this product! It's amazing and works perfectly.`
     - Analysis Type: `Sentiment`

3. **Execute and Verify:**
   - ✅ Should return sentiment analysis (Positive/Negative/Neutral)

---

## 🔍 How to Verify Results

### Visual Indicators:
- **🟢 Green Checkmark**: Node executed successfully
- **🔴 Red X**: Node failed (check error message)
- **🔄 Spinning Icon**: Node is currently executing
- **📊 Output Display**: Click on node to see output data

### Check Node Output:
1. **Double-click** on any executed node
2. Look at the **Output** section in the configuration panel
3. Verify the data structure matches expectations

### Browser Console:
1. Open **Developer Tools** (F12)
2. Go to **Console** tab
3. Look for:
   - ✅ Success messages
   - ❌ Error messages
   - 📝 Execution logs

### Email Verification:
- Check your **inbox** (and spam folder)
- Verify email contains correct content
- Check email headers for sent time

---

## 🐛 Common Issues & Solutions

### Issue: "AI execution failed"
**Solution:**
- Check `.env.local` has `GEMINI_API_KEY` set
- Verify API key is valid
- Check browser console for detailed error

### Issue: "Email not configured"
**Solution:**
- Add SMTP settings to `.env.local`:
  ```
  SMTP_HOST="smtp.gmail.com"
  SMTP_PORT="587"
  SMTP_USER="your-email@gmail.com"
  SMTP_PASSWORD="your-app-password"
  ```

### Issue: "Model not found"
**Solution:**
- Set `GEMINI_MODEL` in `.env.local`:
  ```
  GEMINI_MODEL="gemini-pro"
  ```
  Or try: `gemini-1.5-pro`, `gemini-2.0-flash-lite`

### Issue: Template variables not working
**Solution:**
- Use correct syntax: `{{input.fieldName}}`
- For AI Text Generator output: `{{input.generatedText}}`
- Check that nodes are connected properly

---

## 📝 Testing Checklist

Before testing, ensure:
- [ ] `.env.local` file exists with all required variables
- [ ] Dev server is running (`npm run dev`)
- [ ] Browser console is open (F12)
- [ ] You have a valid email address for testing

During testing:
- [ ] All nodes are properly connected
- [ ] Each node is configured correctly
- [ ] Execute button works
- [ ] Nodes show execution status
- [ ] Output data is correct
- [ ] No errors in console

After testing:
- [ ] Verify email received (if using email node)
- [ ] Check output data structure
- [ ] Review any error messages
- [ ] Test with different inputs

---

## 🎯 Advanced Testing Scenarios

### Test with Template Variables:
```
Schedule Trigger → AI Text Generator → Send Email
```
In Email body, try:
- `{{input.generatedText}}` - Full generated text
- `{{input.model}}` - Model name used
- `{{input.usage.totalTokens}}` - Token usage

### Test with Multiple Nodes:
```
Schedule Trigger → AI Text Generator → Data Transform → Send Email
```
Data Transform code:
```javascript
return {
  ...input,
  summary: input.generatedText.substring(0, 100) + "..."
};
```

### Test Error Handling:
- Remove API key from `.env.local` → Should show error
- Use invalid email address → Should show error
- Disconnect nodes → Should not execute

---

## 💡 Tips for Effective Testing

1. **Start Simple**: Test one node at a time
2. **Use Schedule Trigger**: Easiest way to test (no external setup needed)
3. **Check Console**: Always monitor browser console for errors
4. **Test Incrementally**: Add one node at a time and test
5. **Use Real Data**: Test with real email addresses and valid prompts
6. **Document Results**: Note what works and what doesn't

---

## 🚀 Quick Test Commands

### Check Environment Variables:
```bash
# Windows PowerShell
Get-Content .env.local

# Linux/Mac
cat .env.local
```

### Check if Server is Running:
- Open browser: http://localhost:3000
- Should see workflow canvas

### Test API Directly (Optional):
```bash
# Test AI API
curl -X POST http://localhost:3000/api/ai/execute \
  -H "Content-Type: application/json" \
  -d '{"type":"aiTextGenerator","config":{"prompt":"Hello","temperature":"0.7","maxTokens":"100"},"input":{}}'
```

---

Happy Testing! 🎉
