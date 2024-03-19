from setuptools import setup, find_packages

setup(
    name='aws-messaging-tools',
    version='0.1.0',
    author='Aleda Jonquil',
    author_email='aleda.domespace@gmail.com',
    description=('Tools for transferring messages between AWS SQS and S3'),
    license='MIT',
    keywords='AWS SQS S3 messaging boto3',
    url='http://example.com/aws-messaging-tools/',
    packages=find_packages(),
    long_description=open('README.md').read(),
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
    ],
    python_requires='>=3.6',
    install_requires=[
        'boto3',  # AWS SDK for Python
    ],
    entry_points={
        'console_scripts': [
            's3_to_sqs=your_module.s3_to_sqs:main',  # Adjust with the actual path to your script's main function
            'dlq_to_s3=your_module.dlq_to_s3:main',  # Adjust similarly
        ],
    },
)
