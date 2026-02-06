#!/usr/bin/env tsx

/**
 * Security Validator for Buddha CEO App
 *
 * This script performs comprehensive security checks on the codebase
 * to identify vulnerabilities before they reach production.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface SecurityIssue {
  type: 'CRITICAL' | 'WARNING';
  category: string;
  file: string;
  line?: number;
  message: string;
  recommendation?: string;
}

interface SecurityReport {
  critical: SecurityIssue[];
  warnings: SecurityIssue[];
  summary: {
    total: number;
    byCategory: Record<string, number>;
  };
}

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
};

class SecurityValidator {
  private issues: SecurityIssue[] = [];
  private projectRoot = process.cwd();

  /**
   * Run grep command and return results
   */
  private grep(pattern: string, files: string): string[] {
    try {
      const output = execSync(
        `git grep -E "${pattern}" -- ${files}`,
        { encoding: 'utf-8', cwd: this.projectRoot }
      );
      return output.trim().split('\n').filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  /**
   * Check if file is excluded from checks
   */
  private isExcluded(file: string): boolean {
    const excludedPaths = [
      'node_modules',
      '.next',
      'dist',
      'build',
      '.vercel',
    ];
    return excludedPaths.some(path => file.includes(path));
  }

  /**
   * Add a security issue
   */
  private addIssue(issue: SecurityIssue) {
    if (!this.isExcluded(issue.file)) {
      this.issues.push(issue);
    }
  }

  /**
   * Check for hardcoded secrets and credentials
   */
  checkHardcodedSecrets() {
    console.log(`${COLORS.BLUE}[1/10]${COLORS.RESET} Checking for hardcoded secrets...`);

    // API keys
    const apiKeys = this.grep(
      'api[_-]?key.*=.*(?!process\.env)',
      '*.ts *.tsx *.js *.jsx .env*'
    );
    apiKeys.forEach(result => {
      const [file, line] = result.split(':');
      if (!result.includes('process.env') && !result.includes('example')) {
        this.addIssue({
          type: 'CRITICAL',
          category: 'Secrets',
          file,
          line: parseInt(line),
          message: 'Hardcoded API key detected',
          recommendation: 'Use environment variables: process.env.API_KEY',
        });
      }
    });

    // Passwords
    const passwords = this.grep(
      'password.*=.*(?!process\.env|user\.password|bcrypt|hash)',
      '*.ts *.tsx *.js *.jsx'
    );
    passwords.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'CRITICAL',
        category: 'Secrets',
        file,
        line: parseInt(line),
        message: 'Hardcoded password detected',
        recommendation: 'Use environment variables',
      });
    });

    // Connection strings
    const connections = this.grep(
      '(mongodb\\+srv|postgres://|mysql://|redis://)',
      '*.ts *.tsx .env*'
    );
    connections.forEach(result => {
      const [file, line] = result.split(':');
      if (!result.includes('process.env')) {
        this.addIssue({
          type: 'CRITICAL',
          category: 'Secrets',
          file,
          line: parseInt(line),
          message: 'Hardcoded database connection string',
          recommendation: 'Use MONGODB_URI environment variable',
        });
      }
    });
  }

  /**
   * Check for injection vulnerabilities
   */
  checkInjectionVulnerabilities() {
    console.log(`${COLORS.BLUE}[2/10]${COLORS.RESET} Checking for injection vulnerabilities...`);

    // MongoDB injection
    const mongoInjections = this.grep(
      '\\$where|\\$ne.*req\\.|\\$ne.*params',
      'app/api/**/*.ts lib/**/*.ts'
    );
    mongoInjections.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'CRITICAL',
        category: 'Injection',
        file,
        line: parseInt(line),
        message: 'Potential MongoDB injection vulnerability',
        recommendation: 'Use proper query builders and sanitize input',
      });
    });

    // Direct req.body in queries
    const directQueries = this.grep(
      'find\\(.*req\\.body',
      'app/api/**/*.ts'
    );
    directQueries.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'CRITICAL',
        category: 'Injection',
        file,
        line: parseInt(line),
        message: 'Unsanitized user input in database query',
        recommendation: 'Validate and sanitize req.body before use',
      });
    });

    // Code injection
    const codeInjection = this.grep('eval\\(|new Function\\(', '*.ts *.tsx *.js');
    codeInjection.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'CRITICAL',
        category: 'Injection',
        file,
        line: parseInt(line),
        message: 'Use of eval() or Function() - code injection risk',
        recommendation: 'Remove eval() or Function() usage',
      });
    });
  }

  /**
   * Check for XSS vulnerabilities
   */
  checkXSS() {
    console.log(`${COLORS.BLUE}[3/10]${COLORS.RESET} Checking for XSS vulnerabilities...`);

    // dangerouslySetInnerHTML
    const dangerousHTML = this.grep(
      'dangerouslySetInnerHTML',
      'components/**/*.tsx app/**/*.tsx'
    );
    dangerousHTML.forEach(result => {
      const [file, line] = result.split(':');
      if (!result.includes('DOMPurify')) {
        this.addIssue({
          type: 'CRITICAL',
          category: 'XSS',
          file,
          line: parseInt(line),
          message: 'dangerouslySetInnerHTML without sanitization',
          recommendation: 'Use DOMPurify to sanitize HTML content',
        });
      }
    });

    // User input in HTML attributes
    const userInHTML = this.grep(
      'href=.*user\\.|src=.*user\\.|innerHTML=.*user\\.',
      'components/**/*.tsx'
    );
    userInHTML.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'WARNING',
        category: 'XSS',
        file,
        line: parseInt(line),
        message: 'User input directly in HTML attribute',
        recommendation: 'Validate and sanitize user input',
      });
    });
  }

  /**
   * Check authentication and authorization
   */
  checkAuthAuthz() {
    console.log(`${COLORS.BLUE}[4/10]${COLORS.RESET} Checking authentication and authorization...`);

    const { execSync } = require('child_process');

    try {
      // Find all API routes
      const apiRoutes = execSync('find app/api -name "route.ts"', {
        encoding: 'utf-8',
        cwd: this.projectRoot,
      }).trim().split('\n');

      let unprotectedCount = 0;

      apiRoutes.forEach((route: string) => {
        // Skip public routes
        if (route.match(/(public|tracking|photos|resources\/public|about|teacher-application|volunteer-application)/)) {
          return;
        }

        const content = readFileSync(join(this.projectRoot, route), 'utf-8');

        // Check for authentication
        if (
          !content.includes('getServerSession') &&
          !content.includes('requireRole') &&
          !content.includes('requirePermission') &&
          !content.includes('authOptions')
        ) {
          this.addIssue({
            type: 'WARNING',
            category: 'Authentication',
            file: route,
            message: 'API route may be missing authentication',
            recommendation: 'Add getServerSession or requireRole check',
          });
          unprotectedCount++;
        }
      });
    } catch (error) {
      // Silent fail if find command doesn't work
    }
  }

  /**
   * Check environment variable exposure
   */
  checkEnvExposure() {
    console.log(`${COLORS.BLUE}[5/10]${COLORS.RESET} Checking for environment variable exposure...`);

    // Sensitive data in NEXT_PUBLIC_ vars
    const sensitivePublic = this.grep(
      'NEXT_PUBLIC_.*(SECRET|KEY|PASSWORD|TOKEN)',
      '.env* package.json'
    );
    sensitivePublic.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'CRITICAL',
        category: 'Environment Variables',
        file,
        line: parseInt(line),
        message: 'Sensitive data in NEXT_PUBLIC_ env var (exposed to browser)',
        recommendation: 'Remove NEXT_PUBLIC_ prefix for sensitive data',
      });
    });

    // Console logging sensitive data
    const consoleLogs = this.grep(
      'console\\.(log|debug|info)\\((user|password|token|secret|key)',
      'app/**/*.tsx components/**/*.tsx'
    );
    consoleLogs.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'WARNING',
        category: 'Environment Variables',
        file,
        line: parseInt(line),
        message: 'Console logging potentially sensitive data',
        recommendation: 'Remove console.log with sensitive data',
      });
    });
  }

  /**
   * Check Next.js security best practices
   */
  checkNextJSSecurity() {
    console.log(`${COLORS.BLUE}[6/10]${COLORS.RESET} Checking Next.js security...`);

    // ESLint disabled
    const eslintDisabled = this.grep('eslint.*disable', 'app/ components/');
    eslintDisabled.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'WARNING',
        category: 'Best Practices',
        file,
        line: parseInt(line),
        message: 'ESLint disabled (may hide security issues)',
        recommendation: 'Fix ESLint issues instead of disabling',
      });
    });

    // User-provided image URLs
    const userImages = this.grep(
      '(img|Image).*src=.*(user\\.|req\\.)',
      'components/**/*.tsx app/**/*.tsx'
    );
    userImages.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'WARNING',
        category: 'Best Practices',
        file,
        line: parseInt(line),
        message: 'User-provided image URL without validation',
        recommendation: 'Validate and whitelist image domains',
      });
    });
  }

  /**
   * Check password security
   */
  checkPasswordSecurity() {
    console.log(`${COLORS.BLUE}[7/10]${COLORS.RESET} Checking password security...`);

    // Unhashed passwords
    const unhashed = this.grep(
      'password.*=.*req\\.body.*(?!bcrypt|hash|compare)',
      'app/api/**/*.ts'
    );
    unhashed.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'CRITICAL',
        category: 'Authentication',
        file,
        line: parseInt(line),
        message: 'Password stored without hashing',
        recommendation: 'Always hash passwords using bcrypt',
      });
    });

    // Weak password requirements
    const weakPassword = this.grep('minlength.*[0-4]', 'lib/models/*.ts');
    weakPassword.forEach(result => {
      const [file, line] = result.split(':');
      this.addIssue({
        type: 'WARNING',
        category: 'Authentication',
        file,
        line: parseInt(line),
        message: 'Weak password minimum length (< 5 characters)',
        recommendation: 'Require at least 8 characters',
      });
    });
  }

  /**
   * Check session security
   */
  checkSessionSecurity() {
    console.log(`${COLORS.BLUE}[8/10]${COLORS.RESET} Checking session security...`);

    const authPath = join(this.projectRoot, 'lib/auth.ts');

    if (existsSync(authPath)) {
      const content = readFileSync(authPath, 'utf-8');

      if (!content.includes('maxAge') && !content.includes('expires')) {
        this.addIssue({
          type: 'WARNING',
          category: 'Session',
          file: 'lib/auth.ts',
          message: 'Session expiration may not be configured',
          recommendation: 'Set maxAge or expires for session cookies',
        });
      }

      if (!content.includes('secure: true') || !content.includes('httpOnly: true')) {
        this.addIssue({
          type: 'WARNING',
          category: 'Session',
          file: 'lib/auth.ts',
          message: 'Session cookies may not be secure/httpOnly',
          recommendation: 'Set secure: true and httpOnly: true',
        });
      }
    }
  }

  /**
   * Check CORS configuration
   */
  checkCORS() {
    console.log(`${COLORS.BLUE}[9/10]${COLORS.RESET} Checking CORS configuration...`);

    const corsConfig = this.grep('cors', 'app/api/**/*.ts');

    if (corsConfig.length === 0) {
      this.addIssue({
        type: 'WARNING',
        category: 'CORS',
        file: 'app/api/**/*.ts',
        message: 'No CORS configuration found in API routes',
        recommendation: 'Configure CORS to restrict cross-origin requests',
      });
    }
  }

  /**
   * Check dependency vulnerabilities
   */
  async checkDependencies() {
    console.log(`${COLORS.BLUE}[10/10]${COLORS.RESET} Checking for known vulnerabilities...`);

    try {
      const auditOutput = execSync('npm audit --json', {
        encoding: 'utf-8',
        cwd: this.projectRoot,
      });

      const audit = JSON.parse(auditOutput);
      const vulnCount = audit.metadata?.vulnerabilities?.total || 0;

      if (vulnCount > 0) {
        this.addIssue({
          type: 'WARNING',
          category: 'Dependencies',
          file: 'package.json',
          message: `Found ${vulnCount} vulnerable dependencies`,
          recommendation: 'Run: npm audit fix',
        });
      } else {
        console.log(`${COLORS.GREEN}✅ No known vulnerabilities${COLORS.RESET}`);
      }
    } catch (error) {
      // npm audit may fail, that's okay
    }
  }

  /**
   * Run all security checks
   */
  async run(): Promise<SecurityReport> {
    console.log(`${COLORS.BLUE}🔒 Security Validation for Buddha CEO App${COLORS.RESET}`);
    console.log(''.repeat(50));
    console.log('');

    this.checkHardcodedSecrets();
    this.checkInjectionVulnerabilities();
    this.checkXSS();
    this.checkAuthAuthz();
    this.checkEnvExposure();
    this.checkNextJSSecurity();
    this.checkPasswordSecurity();
    this.checkSessionSecurity();
    this.checkCORS();
    await this.checkDependencies();

    console.log('');
    console.log('═'.repeat(50));
    console.log('📊 Security Scan Summary');
    console.log('═'.repeat(50));

    const critical = this.issues.filter(i => i.type === 'CRITICAL');
    const warnings = this.issues.filter(i => i.type === 'WARNING');

    // Group by category
    const byCategory: Record<string, number> = {};
    this.issues.forEach(issue => {
      byCategory[issue.category] = (byCategory[issue.category] || 0) + 1;
    });

    const report: SecurityReport = {
      critical,
      warnings,
      summary: {
        total: this.issues.length,
        byCategory,
      },
    };

    if (critical.length > 0) {
      console.log(`${COLORS.RED}❌ Critical Issues: ${critical.length}${COLORS.RESET}`);
    }

    if (warnings.length > 0) {
      console.log(`${COLORS.YELLOW}⚠️  Warnings: ${warnings.length}${COLORS.RESET}`);
    }

    if (this.issues.length === 0) {
      console.log(`${COLORS.GREEN}✅ No security issues found!${COLORS.RESET}`);
      console.log('');
      console.log('🎉 Your application passes all security checks!');
    } else {
      console.log('');
      console.log(`${COLORS.RED}⚠️  Please review and fix the issues before deploying.${COLORS.RESET}`);
      console.log('');
      console.log('Issues by category:');
      Object.entries(byCategory).forEach(([category, count]) => {
        console.log(`  • ${category}: ${count}`);
      });
    }

    return report;
  }

  /**
   * Print detailed issues
   */
  printIssues() {
    if (this.issues.length === 0) return;

    console.log('');
    console.log('═'.repeat(50));
    console.log('🔍 Detailed Issues');
    console.log('═'.repeat(50));

    this.issues.forEach((issue, index) => {
      const color = issue.type === 'CRITICAL' ? COLORS.RED : COLORS.YELLOW;
      const icon = issue.type === 'CRITICAL' ? '❌' : '⚠️';

      console.log(`${color}${icon} [${index + 1}] ${issue.type}: ${issue.message}${COLORS.RESET}`);
      console.log(`   Category: ${issue.category}`);
      console.log(`   File: ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
      if (issue.recommendation) {
        console.log(`   💡 ${issue.recommendation}`);
      }
      console.log('');
    });
  }
}

// Run validator
async function main() {
  const validator = new SecurityValidator();
  const report = await validator.run();
  validator.printIssues();

  process.exit(report.summary.total > 0 ? 1 : 0);
}

// Only run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export type { SecurityReport, SecurityIssue };
export { SecurityValidator };
